from llama_index import GPTSimpleVectorIndex
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import sys
import openai
import logging
from create_index import create_index
openai.api_base = os.environ.get('OPENAI_PROXY')

user_data_dir = 'userData'

if not os.path.exists(f"{user_data_dir}/html"):
    os.makedirs(f"{user_data_dir}/html")
if not os.path.exists(f"{user_data_dir}/index"):
    os.makedirs(f"{user_data_dir}/index")
if not os.path.exists(f"{user_data_dir}/temp"):
    os.makedirs(f"{user_data_dir}/temp")


app = Flask(__name__, static_folder=f"{user_data_dir}")


CORS(app)

logger = logging.getLogger(__name__)
file_handler = logging.FileHandler('app.log')
file_handler.setLevel(logging.ERROR)
logger.addHandler(file_handler)

load_dotenv()


@app.errorhandler(Exception)
def handle_error(error):
    """全局错误处理"""
    message = str(error)
    status_code = 500
    if hasattr(error, 'status_code'):
        status_code = error.status_code
    print(message)
    response = jsonify({'message': message})
    response.status_code = status_code
    logger.error(response)
    return response


@app.route('/api/summarize', methods=["GET"])
def summarize_index():
    index_name = request.args.get("index")
    open_ai_key = request.args.get("openAiKey")
    if open_ai_key:
        os.environ['OPENAI_API_KEY'] = open_ai_key

    index = GPTSimpleVectorIndex.load_from_disk(
        f'{user_data_dir}/index/{index_name}.json')
    res = index.query(
        'What is a summary of this document?', response_mode="summarize")
    response_json = {
        "answer": str(res),
        "cost": index.llm_predictor.last_token_usage,
        "sources": [{"text": str(x.source_text),
                     "similarity": round(x.similarity, 2),
                     "extraInfo": x.extra_info
                     } for x in res.source_nodes]
    }

    # 用完了就删掉，防止别人的key被反复使用
    if open_ai_key:
        os.environ['OPENAI_API_KEY'] = ""

    return jsonify(response_json)


@app.route('/api/query', methods=["GET"])
def query_index():
    query_text = request.args.get("query")
    index_name = request.args.get("index")
    open_ai_key = request.args.get("openAiKey")
    if open_ai_key:
        os.environ['OPENAI_API_KEY'] = open_ai_key

    index = GPTSimpleVectorIndex.load_from_disk(
        f'{user_data_dir}/index/{index_name}.json')

    print(os.environ.get('OPENAI_PROXY'), os.environ.get('OPENAI_API_KEY'))
    res = index.query(query_text)
    response_json = {
        "answer": str(res),
        "cost": index.llm_predictor.last_token_usage,
        "sources": [{"text": str(x.source_text),
                     "similarity": round(x.similarity, 2),
                     "extraInfo": x.extra_info
                     } for x in res.source_nodes]
    }

    # 用完了就删掉，防止别人的key被反复使用
    if open_ai_key:
        os.environ['OPENAI_API_KEY'] = ""

    return jsonify(response_json)


@app.route('/api/upload', methods=["POST"])
def upload_file():
    filepath = None
    try:
        uploaded_file = request.files["file"]
        filename = secure_filename(uploaded_file.filename)
        print(os.getcwd(), os.path.abspath(__file__))
        filepath = os.path.join(f'{user_data_dir}/temp',
                                os.path.basename(filename))
        uploaded_file.save(filepath)

        token_usage = create_index(filepath, os.path.splitext(filename)[0])
    except Exception as e:
        # cleanup temp file
        print(e, 'upload error')
        if filepath is not None and os.path.exists(filepath):
            os.remove(filepath)
        return "Error: {}".format(str(e)), 500

    # cleanup temp file
    if filepath is not None and os.path.exists(filepath):
        os.remove(filepath)

    return jsonify(token_usage), 200


@app.route('/api/index-list', methods=["GET"])
def get_index_files():
    dir = f'{user_data_dir}/index'
    files = os.listdir(dir)
    return files


@app.route('/api/html-list', methods=["GET"])
def get_html_files():
    dir = f'{user_data_dir}/html'
    files = os.listdir(dir)
    return [{"path": f'/{dir}/{file}', "name": os.path.splitext(file)[0]} for file in files]


if __name__ == "__main__":
    app.run()
