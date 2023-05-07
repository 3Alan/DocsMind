"""Read PDF files."""

import shutil
from pathlib import Path
from typing import Any, List

from llama_index.langchain_helpers.text_splitter import SentenceSplitter
from llama_index.readers.base import BaseReader
from llama_index.readers.schema.base import Document

# https://github.com/emptycrown/llama-hub/blob/main/loader_hub/file/cjk_pdf/base.py

staticPath = "static"


class CJKPDFReader(BaseReader):
    """CJK PDF reader.

    Extract text from PDF including CJK (Chinese, Japanese and Korean) languages using pdfminer.six.
    """

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        """Init params."""
        super().__init__(*args, **kwargs)

    def load_data(self, filepath: Path, filename) -> List[Document]:
        """Parse file."""

        # Import pdfminer
        from io import StringIO

        from pdfminer.converter import TextConverter
        from pdfminer.layout import LAParams
        from pdfminer.pdfinterp import PDFPageInterpreter, PDFResourceManager
        from pdfminer.pdfpage import PDFPage

        # Create a resource manager
        rsrcmgr = PDFResourceManager()
        # Create an object to store the text
        retstr = StringIO()
        # Create a text converter
        codec = "utf-8"
        laparams = LAParams()
        device = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
        # Create a PDF interpreter
        interpreter = PDFPageInterpreter(rsrcmgr, device)
        # Open the PDF file
        fp = open(filepath, "rb")
        # Create a list to store the text of each page
        document_list = []
        # Extract text from each page
        for i, page in enumerate(PDFPage.get_pages(fp)):
            interpreter.process_page(page)

            # Get the text
            text = retstr.getvalue()

            sentence_splitter = SentenceSplitter(chunk_size=400)
            text_chunks = sentence_splitter.split_text(text)

            document_list += [
                Document(t, extra_info={"page_no": i + 1}) for t in text_chunks
            ]
            # Clear the text
            retstr.truncate(0)
            retstr.seek(0)
        # Close the file
        fp.close()
        # Close the device
        device.close()

        shutil.copy2(filepath, f"{staticPath}/file/{filename}")

        return document_list
