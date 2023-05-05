from typing import Any, List

import tiktoken
from bs4 import BeautifulSoup
from llama_index.readers.base import BaseReader
from llama_index.readers.schema.base import Document

staticPath = "static"


def encode_string(string: str, encoding_name: str = "p50k_base"):
    encoding = tiktoken.get_encoding(encoding_name)
    return encoding.encode(string)


def decode_string(token: str, encoding_name: str = "p50k_base"):
    encoding = tiktoken.get_encoding(encoding_name)
    return encoding.decode(token)


def num_tokens_from_string(string: str, encoding_name: str = "p50k_base") -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens


def split_text_to_doc(
    text: str, current_chunk_id, chunk_size: int = 400
) -> List[Document]:
    """Split text into chunks of a given size."""
    chunks = []
    token_len = num_tokens_from_string(text)

    for i in range(0, token_len, chunk_size):
        encode_text = encode_string(text)
        decode_text = decode_string(encode_text[i : i + chunk_size]).strip()
        chunks.append(
            Document(
                decode_text,
                extra_info={"chunk_id": f"chunk-{current_chunk_id}"},
            )
        )

    return chunks


class PdfReader(BaseReader):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        """Init params."""
        super().__init__(*args, **kwargs)

    def load_data(self, html, filename) -> List[Document]:
        soup = BeautifulSoup(html, "html.parser")
        document_list = []

        page_tag_list = soup.find_all(class_="pf")

        for index, tag in enumerate(page_tag_list):
            tag["data-chunk_id"] = f"chunk-{index+1}"
            text_tag_list = tag.find_all(class_="t")
            page_text = ""

            for text_tag in text_tag_list:
                page_text += f"{text_tag.text} "

            document_list += split_text_to_doc(page_text, index + 1)

        # # 保存修改后的HTML文件
        with open(f"{staticPath}/html/{filename}.html", "w", encoding="utf-8") as f:
            f.write(str(soup))

        return document_list
