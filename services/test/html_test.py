
from llama_index.readers.base import BaseReader
from llama_index.readers.schema.base import Document

from bs4 import BeautifulSoup
from bs4.element import NavigableString
import tiktoken


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


# 读取HTML文件
# with open('./test/test.html', 'r', encoding='utf-8') as f:
with open('./test.html', 'r', encoding='utf-8') as f:
    html = f.read()
# 解析HTML
soup = BeautifulSoup(html, 'html.parser')

# 找到所有的标题标签
headings = soup.find_all(['h1', 'h2', 'h3'])

# 每个chunk的长度限制（单位token）
chunk_size = 20
document_list = []
index = 1

for i in range(len(headings) - 1):
    start = headings[i]
    end = headings[i + 1]
    start['data-chunk_id'] = f"chunk-{index}"
    content = start.next_elements
    chunk_text = ''

    for elem in content:
        trim_text = elem.get_text().strip()
        if not trim_text:
            continue
        # 文本节点
        if isinstance(elem, NavigableString):
            token_len = num_tokens_from_string(trim_text)
            if num_tokens_from_string(chunk_text, 'p50k_base') + token_len + 1 < chunk_size:
                chunk_text = f"{chunk_text} {trim_text}"
            elif token_len > chunk_size:
                # 单个的内容已经超过了chunk_size的情况，先将当前的chunk_text处理到并新建一个chunk
                index = index + 1
                document_list.append(
                    Document(chunk_text.strip(), extra_info={"chunk_id": f"chunk-{index}"}))
                # TODO: 当前是以token单位分隔的，实际要以字符串长度分割
                for i in range(0, token_len, chunk_size):
                    encode_text = encode_string(trim_text)
                    decode_text = decode_string(
                        encode_text[i:i+chunk_size]).strip()
                    document_list.append(
                        Document(decode_text, extra_info={"chunk_id": f"chunk-{index}"}))
            else:
                # chunk的数量超出了chunk_size，所以新开一个chunk
                index = index + 1
                document_list.append(
                    Document(chunk_text.strip(), extra_info={"chunk_id": f"chunk-{index}"}))
                chunk_text = ''
        # 非文本节点
        else:
            elem['data-chunk_id'] = f"chunk-{index}"
            if elem == end:
                document_list.append(
                    Document(chunk_text.strip(), extra_info={"chunk_id": f"chunk-{index}"}))
                chunk_text = ''
                index = index + 1
                elem['data-chunk_id'] = f"chunk-{index}"
                break

start = headings[-1]
start['data-chunk_id'] = f"chunk-{index}"
content = start.next_elements
chunk_text = ''

for elem in content:
    trim_text = elem.get_text().strip()
    if not trim_text:
        continue
    # 文本节点
    if isinstance(elem, NavigableString):
        token_len = num_tokens_from_string(trim_text)
        if num_tokens_from_string(chunk_text, 'p50k_base') + token_len + 1 < chunk_size:
            chunk_text = f"{chunk_text} {trim_text}"
        elif token_len > chunk_size:
            # 单个的内容已经超过了chunk_size的情况，先将当前的chunk_text处理到并新建一个chunk
            index = index + 1
            document_list.append(
                Document(chunk_text.strip(), extra_info={"chunk_id": f"chunk-{index}"}))
            chunk_text = ''

            for i in range(0, token_len, chunk_size):
                encode_text = encode_string(trim_text)
                decode_text = decode_string(
                    encode_text[i:i+chunk_size]).strip()
                document_list.append(
                    Document(decode_text, extra_info={"chunk_id": f"chunk-{index}"}))
        else:
            # chunk的数量超出了chunk_size，所以新开一个chunk
            index = index + 1
            document_list.append(
                Document(chunk_text.strip(), extra_info={"chunk_id": f"chunk-{index}"}))
            chunk_text = ''
    # 非文本节点
    else:
        elem['data-chunk_id'] = f"chunk-{index}"

document_list.append(
    Document(chunk_text.strip(), extra_info={"chunk_id": f"chunk-{index}"}))

print(str(soup))
print(document_list)
