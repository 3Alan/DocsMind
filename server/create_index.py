import os

import markdown
from custom_loader import CustomReader
from llama_index import GPTSimpleVectorIndex, MockEmbedding, ServiceContext

staticPath = "static"


def create_index(filepath, filename) -> int:
    html = ""
    name, ext = os.path.splitext(filename)
    # load data
    with open(filepath, "r", encoding="utf-8") as f:
        file_text = f.read()

    if ext == ".pdf":
        # TODO: Use pdf2htmlEX to convert PDF to HTML.
        html = "todo"
    elif ext == ".md":
        html = markdown.markdown(
            file_text, extensions=["pymdownx.superfences", "tables", "pymdownx.details"]
        )
    elif ext == ".html":
        html = file_text

    loader = CustomReader()
    documents = loader.load_data(html=html, filename=name)

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
