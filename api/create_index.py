import openai
import os
from custom_loader import CustomReader
import markdown
from llama_index import GPTSimpleVectorIndex

user_data_dir = 'userData'


def create_index(filepath, filename) -> int:
    openai.api_base = os.environ.get('OPENAI_PROXY')

    with open(filepath, 'r', encoding='utf-8') as f:
        md_text = f.read()

    html = markdown.markdown(md_text, extensions=['fenced_code', 'tables'])

    loader = CustomReader()

    documents = loader.load_data(
        html=html, filename=filename)
    index = GPTSimpleVectorIndex(documents)

    # save to disk
    index.save_to_disk(f'{user_data_dir}/index/{filename}.json')

    return index.embed_model.last_token_usage
