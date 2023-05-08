import { useEffect, useRef } from 'react';
import PageSpin from '../pageSpin';

export default function HtmlViewer({ html, loading }: { html: string; loading: boolean }) {
  const htmlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (htmlRef.current) {
      htmlRef.current.scrollTop = 0;
    }
  }, [html]);

  return (
    <div
      ref={htmlRef}
      className="markdown-body h-full rounded-lg overflow-auto relative w-[700px] shadow-md"
    >
      {loading ? <PageSpin /> : <div dangerouslySetInnerHTML={{ __html: html }} />}
    </div>
  );
}
