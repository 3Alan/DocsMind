import markdown
from custom_loader import CustomReader
from llama_index import GPTSimpleVectorIndex, MockEmbedding, ServiceContext

staticPath = "static"

def add_heading(markdown_text, heading_text, level=1):
    """Add a heading to an existing Markdown text.

    Args:
        markdown_text (str): The existing Markdown text to which the heading will be added.
        heading_text (str): The text for the heading.
        level (int): The level of the heading (1 for the largest heading, 6 for the smallest).

    Returns:
        str: The Markdown text with the added heading.
    """
    heading = '#' * level
    new_markdown_text = f"{heading} {heading_text}\n\n{markdown_text}"
    return new_markdown_text


def create_index(filepath, filename) -> int:
    # load data
    with open(filepath, "r", encoding="utf-8") as f:
        md_text = f.read()
    
    # simple fix heading issue
    md_text = add_heading(md_text, filename)
    
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
    index.save_to_disk(f"{staticPath}/index/{filename}.json")

    return embed_model.last_token_usage
