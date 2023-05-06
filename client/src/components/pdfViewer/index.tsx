import { Document, Page } from 'react-pdf/dist/esm/entry.vite';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useEffect, useRef, useState } from 'react';
import eventEmitter from '../../utils/eventEmitter';

export default function PdfViewer({ file }: { file: Blob }) {
  const [numPages, setNumPages] = useState<number>();
  const pdfRef = useRef<PDFDocumentProxy>();

  function scrollToPage({ pageNo, time = 400 }: { pageNo: number; time: number }) {
    console.log(pageNo, time, 'num---num');

    setTimeout(() => {
      if (pdfRef?.current) {
        pdfRef.current?.pages[pageNo - 1].scrollIntoView();
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
      ref={pdfRef}
      className="h-full overflow-auto relative scroll-smooth"
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
