import os

import markdown
from custom_loader import CustomReader
from llama_index import GPTSimpleVectorIndex, MockEmbedding, ServiceContext
from pdf_loader import CJKPDFReader

staticPath = "static"


def create_index(filepath, filename) -> int:
    name, ext = os.path.splitext(filename)

    if ext == ".pdf":
        loader = CJKPDFReader()
        documents = loader.load_data(filepath=filepath, filename=filename)
    elif ext == ".md":
        with open(filepath, "r", encoding="utf-8") as f:
            file_text = f.read()
        html = markdown.markdown(
            file_text, extensions=["pymdownx.superfences", "tables", "pymdownx.details"]
        )
        # TODO: 利用 langchain splitter重写 https://python.langchain.com/en/latest/modules/indexes/text_splitters/examples/markdown.html
        # 直接将markdown分段再分别转化成html，最后将所有html拼接起来并加上chunk_id
        loader = CustomReader()
        documents = loader.load_data(html=html, filename=name)
    elif ext == ".html":
        # TODO:
        pass

    # predictor cost
    embed_model = MockEmbedding(embed_dim=1536)
    service_context = ServiceContext.from_defaults(embed_model=embed_model)
    index = GPTSimpleVectorIndex.from_documents(
        documents, service_context=service_context
    )

    index = GPTSimpleVectorIndex.from_documents(documents)

    # save to disk
    index.save_to_disk(f"{staticPath}/index/{name}.json")

    return embed_model.last_token_usage
