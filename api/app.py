from llama_index import GPTSimpleVectorIndex
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import sys
import openai
from create_index import create_index
openai.api_base = os.environ.get('OPENAI_PROXY')

app_dir = 'chatMarkdown'


if getattr(sys, 'frozen', False):
    template_folder = os.path.join(sys._MEIPASS, 'templates')
    static_folder = os.path.join(sys._MEIPASS, f"{app_dir}/html")
    app = Flask(__name__, template_folder=template_folder,
                static_folder=static_folder)
else:
    app = Flask(__name__, static_folder=f"{app_dir}/html")


CORS(app)

load_dotenv(f'{app_dir}/.env')


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
    return response

# 获取app下保存的文件


@app.route(f'/{app_dir}/<path:path>', methods=["GET"])
def get_static_files(path):
    file_path = f'{app_dir}/{path}'
    print(file_path, path, '-----------')
    if os.path.isfile(file_path):
        return send_file(file_path)

    return jsonify({'message': 'Not found'}), 404


@app.route('/api/summarize', methods=["GET"])
def summarize_index():
    index_name = request.args.get("index")
    index = GPTSimpleVectorIndex.load_from_disk(
        f'{app_dir}/index/{index_name}.json')
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
    return jsonify(response_json)


@app.route('/api/query', methods=["GET"])
def query_index():
    query_text = request.args.get("query")
    index_name = request.args.get("index")
    index = GPTSimpleVectorIndex.load_from_disk(
        f'{app_dir}/index/{index_name}.json')
    res = index.query(query_text)
    response_json = {
        "answer": str(res),
        "cost": index.llm_predictor.last_token_usage,
        "sources": [{"text": str(x.source_text),
                     "similarity": round(x.similarity, 2),
                     "extraInfo": x.extra_info
                     } for x in res.source_nodes]
    }
    return jsonify(response_json)


@app.route('/api/upload', methods=["POST"])
def upload_file():
    filepath = None
    try:
        uploaded_file = request.files["file"]
        filename = secure_filename(uploaded_file.filename)
        print(os.getcwd(), os.path.abspath(__file__))
        filepath = os.path.join(f'{app_dir}/temp',
                                os.path.basename(filename))
        if not os.path.exists(f'{app_dir}/temp'):
            os.makedirs(f'{app_dir}/temp')
        uploaded_file.save(filepath)

        token_usage = create_index(filepath, os.path.splitext(filename)[0])
    except Exception as e:
        # cleanup temp file
        print(e, 'upload error')
        if filepath is not None and os.path.exists(filepath):
            os.remove(filepath)
            return "Error: file exist", 500
        return "Error: {}".format(str(e)), 500

    # cleanup temp file
    if filepath is not None and os.path.exists(filepath):
        os.remove(filepath)

    return jsonify(token_usage), 200


@app.route('/api/index-list', methods=["GET"])
def get_index_files():
    dir = f'{app_dir}/index'
    files = os.listdir(dir)
    return files


@app.route('/api/html-list', methods=["GET"])
def get_html_files():
    dir = f'{app_dir}/html'
    files = os.listdir(dir)
    return [{"path": f'/{app_dir}/html/{file}', "name": os.path.splitext(file)[0]} for file in files]


if __name__ == "__main__":
    app.run()
