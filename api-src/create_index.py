import os

import markdown
import openai
from custom_loader import CustomReader
from llama_index import GPTSimpleVectorIndex, MockEmbedding, ServiceContext

user_data_dir = "userData"


def create_index(filepath, filename) -> int:
    openai.api_base = os.environ.get("OPENAI_PROXY")

    # load data
    with open(filepath, "r", encoding="utf-8") as f:
        md_text = f.read()
    html = markdown.markdown(
        md_text, extensions=["pymdownx.superfences", "tables", "pymdownx.details"]
    )

    loader = CustomReader()
    documents = loader.load_data(html=html, filename=filename)

    # predictor cost
    embed_model = MockEmbedding(embed_dim=1536)
    service_context = ServiceContext.from_defaults(embed_model=embed_model)
    index = GPTSimpleVectorIndex.from_documents(
        documents, service_context=service_context
    )

    index = GPTSimpleVectorIndex.from_documents(documents)

    # save to disk
    index.save_to_disk(f"{user_data_dir}/index/{filename}.json")

    return embed_model.last_token_usage
