import { Document, Page } from 'react-pdf/dist/esm/entry.vite';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useEffect, useRef, useState } from 'react';
import eventEmitter from '../../utils/eventEmitter';
import PageSpin from '../pageSpin';

export default function PdfViewer({ file }: { file: Blob }) {
  const [numPages, setNumPages] = useState<number>();
  const pdfRef = useRef<HTMLDivElement>(null);

  function scrollToPage(meta: { pageNo: number; time: number }) {
    const { pageNo, time } = meta;

    setTimeout(() => {
      if (pdfRef?.current) {
        pdfRef.current?.children[pageNo - 1].scrollIntoView();
      }
    }, time);
  }

  useEffect(() => {
    eventEmitter.on('scrollToPage', scrollToPage);

    return () => {
      eventEmitter.off('scrollToPage', scrollToPage);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy) {
    setNumPages(nextNumPages);
  }

  return (
    <Document
      inputRef={pdfRef}
      loading={<PageSpin />}
      className="w-[700px] bg-white h-full overflow-auto relative scroll-smooth rounded-lg shadow-md"
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
      options={{
        cMapUrl: 'cmaps/',
        standardFontDataUrl: 'standard_fonts/'
      }}
    >
      {Array.from(new Array(numPages), (_el, index) => (
        <Page width={690} key={`page_${index + 1}`} pageNumber={index + 1} />
      ))}
    </Document>
  );
}
