import json
import logging
import os
import time
from pathlib import Path

import openai
from create_index import create_index
from dotenv import load_dotenv
from flask import Flask, Response, jsonify, request, stream_with_context
from flask_cors import CORS
from llama_index import (
    GPTListIndex,
    GPTSimpleVectorIndex,
    MockEmbedding,
    MockLLMPredictor,
    ServiceContext,
    download_loader,
)
from llama_index.optimization.optimizer import SentenceEmbeddingOptimizer

openai.api_base = os.environ.get("OPENAI_PROXY")

user_data_dir = "userData"

if not os.path.exists(f"{user_data_dir}/html"):
    os.makedirs(f"{user_data_dir}/html")
if not os.path.exists(f"{user_data_dir}/index"):
    os.makedirs(f"{user_data_dir}/index")
if not os.path.exists(f"{user_data_dir}/temp"):
    os.makedirs(f"{user_data_dir}/temp")


app = Flask(__name__, static_folder=f"{user_data_dir}")


CORS(app)

logger = logging.getLogger(__name__)
file_handler = logging.FileHandler("app.log")
file_handler.setLevel(logging.ERROR)
logger.addHandler(file_handler)

load_dotenv()


@app.errorhandler(Exception)
def handle_error(error):
    """全局错误处理"""
    message = str(error)
    status_code = 500
    if hasattr(error, "status_code"):
        status_code = error.status_code
    print("some error:", error)
    response = jsonify({"message": message})
    response.status_code = status_code
    logger.error(response)
    return response


@app.route("/api/summarize", methods=["GET"])
def summarize_index():
    index_name = request.args.get("index")
    open_ai_key = request.args.get("openAiKey")
    if open_ai_key:
        os.environ["OPENAI_API_KEY"] = open_ai_key

    UnstructuredReader = download_loader("UnstructuredReader")
    loader = UnstructuredReader()
    documents = loader.load_data(file=Path(f"./{user_data_dir}/html/{index_name}.html"))
    index = GPTListIndex.from_documents(documents)

    # predictor cost
    llm_predictor = MockLLMPredictor(max_tokens=256)
    embed_model = MockEmbedding(embed_dim=1536)
    service_context = ServiceContext.from_defaults(
        llm_predictor=llm_predictor, embed_model=embed_model
    )

    index.query(
        (
            "Summarize this document and provide three questions related to the summary. Try to use your own words when possible. Keep your answer under 5 sentences. \n"
            "The three questions use the following format(add two line breaks at the beginning of the template):"
            "Template:"
            "Questions you may want to ask 🤔 \n"
            "1. <question_1> \n"
            "2. <question_2> \n"
            "3. <question_3> \n"
        ),
        response_mode="tree_summarize",
        service_context=service_context,
        optimizer=SentenceEmbeddingOptimizer(percentile_cutoff=0.8),
    )

    res = index.query(
        (
            "Summarize this document and provide three questions related to the summary. Try to use your own words when possible. Keep your answer under 5 sentences. \n"
            "The three questions use the following format(add two line breaks at the beginning of the template):"
            "Template:"
            "Questions you may want to ask 🤔 \n"
            "1. <question_1> \n"
            "2. <question_2> \n"
            "3. <question_3> \n"
        ),
        streaming=True,
        response_mode="tree_summarize",
        optimizer=SentenceEmbeddingOptimizer(percentile_cutoff=0.8),
    )
    cost = embed_model.last_token_usage + llm_predictor.last_token_usage

    def response_generator():
        yield json.dumps({"cost": cost, "sources": []})
        yield "\n ###endjson### \n\n"
        for text in res.response_gen:
            yield text

    # 用完了就删掉，防止key被反复使用
    if open_ai_key:
        os.environ["OPENAI_API_KEY"] = ""

    return Response(stream_with_context(response_generator()))


@app.route("/api/query", methods=["GET"])
def query_index():
    query_text = request.args.get("query")
    index_name = request.args.get("index")
    open_ai_key = request.args.get("openAiKey")
    if open_ai_key:
        os.environ["OPENAI_API_KEY"] = open_ai_key

    index = GPTSimpleVectorIndex.load_from_disk(
        f"{user_data_dir}/index/{index_name}.json"
    )

    # predictor cost
    llm_predictor = MockLLMPredictor(max_tokens=256)
    embed_model = MockEmbedding(embed_dim=1536)
    service_context = ServiceContext.from_defaults(
        llm_predictor=llm_predictor, embed_model=embed_model
    )
    index.query(query_text, service_context=service_context)

    res = index.query(query_text, streaming=True)
    cost = embed_model.last_token_usage + llm_predictor.last_token_usage
    sources = [{"extraInfo": x.extra_info} for x in res.source_nodes]

    def response_generator():
        yield json.dumps({"cost": cost, "sources": sources})
        yield "\n ###endjson### \n\n"
        for text in res.response_gen:
            yield text

    # 用完了就删掉，防止key被反复使用
    if open_ai_key:
        os.environ["OPENAI_API_KEY"] = ""

    return Response(stream_with_context(response_generator()))


@app.route("/api/upload", methods=["POST"])
def upload_file():
    filepath = None
    try:
        uploaded_file = request.files["file"]
        filename = uploaded_file.filename
        print(os.getcwd(), os.path.abspath(__file__))
        filepath = os.path.join(f"{user_data_dir}/temp", os.path.basename(filename))
        uploaded_file.save(filepath)

        token_usage = create_index(filepath, os.path.splitext(filename)[0])
    except Exception as e:
        # cleanup temp file
        print(e, "upload error")
        if filepath is not None and os.path.exists(filepath):
            os.remove(filepath)
        return "Error: {}".format(str(e)), 500

    # cleanup temp file
    if filepath is not None and os.path.exists(filepath):
        os.remove(filepath)

    return jsonify(token_usage), 200


@app.route("/api/index-list", methods=["GET"])
def get_index_files():
    dir = f"{user_data_dir}/index"
    files = os.listdir(dir)
    return files


@app.route("/api/html-list", methods=["GET"])
def get_html_files():
    dir = f"{user_data_dir}/html"
    files = os.listdir(dir)
    return [
        {"path": f"/{dir}/{file}", "name": os.path.splitext(file)[0]} for file in files
    ]


if __name__ == "__main__":
    app.run()
