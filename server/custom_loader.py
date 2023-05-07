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


class CustomReader(BaseReader):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        """Init params."""
        super().__init__(*args, **kwargs)

    def load_data(self, html, filename) -> List[Document]:
        soup = BeautifulSoup(html, "html.parser")
        current_chunk_text = ""
        current_chunk_id = 1
        document_list = []
        # 单位是token，openai限制4097，如果实现连续对话大概可以进行6轮对话
        current_chunk_length = 0
        chunk_size = 400

        # 只处理前三级标题，其他的按照段落处理
        headings = ["h1", "h2", "h3"]
        heading_doms = soup.find_all(headings)

        if len(heading_doms) == 0:
            heading_doms = [soup.find()]

        for tag in heading_doms:
            tag["data-chunk_id"] = f"chunk-{current_chunk_id}"
            current_chunk_text = tag.text.strip()

            # 遍历所有兄弟节点，不递归遍历子节点
            next_tag = tag.find_next_sibling()
            while next_tag and next_tag.name not in headings:
                stripped_text = next_tag.text.strip()

                if (
                    current_chunk_length + num_tokens_from_string(stripped_text)
                    > chunk_size
                ):
                    document_list.append(
                        Document(
                            current_chunk_text.strip(),
                            extra_info={"chunk_id": f"chunk-{current_chunk_id}"},
                        )
                    )
                    current_chunk_text = ""
                    current_chunk_length = 0
                    current_chunk_id += 1

                    document_list += split_text_to_doc(stripped_text, current_chunk_id)

                else:
                    current_chunk_text = f"{current_chunk_text} {stripped_text}"
                    current_chunk_length += num_tokens_from_string(stripped_text) + 1

                next_tag["data-chunk_id"] = f"chunk-{current_chunk_id}"
                next_tag = next_tag.find_next_sibling()

            document_list.append(
                Document(
                    current_chunk_text.strip(),
                    extra_info={"chunk_id": f"chunk-{current_chunk_id}"},
                )
            )
            current_chunk_text = ""
            current_chunk_length = 0
            current_chunk_id += 1

        # 保存修改后的HTML文件
        with open(f"{staticPath}/file/{filename}.html", "w", encoding="utf-8") as f:
            f.write(str(soup))

        return document_list
