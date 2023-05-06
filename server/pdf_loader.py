"""Read PDF files."""

from pathlib import Path
from typing import Any, List

from llama_index.readers.base import BaseReader
from llama_index.readers.schema.base import Document

# https://github.com/emptycrown/llama-hub/blob/main/loader_hub/file/cjk_pdf/base.py


class CJKPDFReader(BaseReader):
    """CJK PDF reader.

    Extract text from PDF including CJK (Chinese, Japanese and Korean) languages using pdfminer.six.
    """

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        """Init params."""
        super().__init__(*args, **kwargs)

    def load_data(self, file: Path) -> List[Document]:
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
        fp = open(file, "rb")
        # Create a list to store the text of each page
        document_list = []
        # Extract text from each page
        for i, page in enumerate(PDFPage.get_pages(fp)):
            interpreter.process_page(page)

            # Get the text
            text = retstr.getvalue()

            document_list.append(Document(text, extra_info={"page_no": i + 1}))
            # Clear the text
            retstr.truncate(0)
            retstr.seek(0)
        # Close the file
        fp.close()
        # Close the device
        device.close()

        return document_list
