import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Spinner from './Spinner';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;

const NotesViewer = ({ open, onClose, fileUrl, proxied = false }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setPageNumber(1);
      setScale(1.0);
      setNumPages(null);
    }
  }, [open, fileUrl]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded shadow-lg w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="font-semibold">Document Preview</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setPageNumber(p => Math.max(1, p - 1))}>Prev</button>
            <input value={pageNumber} onChange={(e) => setPageNumber(Number(e.target.value) || 1)} className="w-16 text-center rounded bg-gray-100 px-2 py-1" />
            <div>/ {numPages || '-'}</div>
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setPageNumber(p => Math.min(numPages || 1, p + 1))}>Next</button>
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setScale(s => Math.max(0.5, +(s - 0.1).toFixed(2)))}>-</button>
            <div className="px-2">Zoom</div>
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setScale(s => Math.min(3, +(s + 0.1).toFixed(2)))}>+</button>
            <a href={fileUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-teal-400 text-white rounded">Open</a>
            <a href={fileUrl} download className="px-3 py-1 bg-gray-800 text-white rounded">Download</a>
            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={onClose}>Close</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center relative">
          {loading && <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20"><Spinner size={2} /></div>}
          <div className="p-4" style={{ width: '100%', height: '100%' }}>
            <Document
              file={fileUrl}
              onLoadSuccess={({ numPages }) => { setNumPages(numPages); setLoading(false); }}
              onLoadError={(err) => { console.error('Viewer load error', err); setLoading(false); }}
              onLoadProgress={() => { setLoading(true); }}
            >
              <Page pageNumber={pageNumber} scale={scale} renderAnnotationLayer={false} />
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesViewer;
