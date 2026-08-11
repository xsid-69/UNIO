import { useEffect, useState } from 'react';
import { ArrowSquareOut, CaretLeft, CaretRight, DownloadSimple, MagnifyingGlassMinus, MagnifyingGlassPlus, X } from '@phosphor-icons/react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getPdfFileName, PDF_WORKER_SRC } from '../lib/pdf';

pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;

const NotesViewer = ({ open, onClose, fileUrl }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(false);
  const [nativeFallback, setNativeFallback] = useState(false);

  useEffect(() => {
    if (open) {
      setPageNumber(1);
      setScale(1);
      setNumPages(0);
      setNativeFallback(false);
    }
  }, [open, fileUrl]);

  if (!open) return null;

  return <div className="modal-layer"><section className="reader-modal" role="dialog" aria-modal="true" aria-label="Document preview"><header className="reader-toolbar"><div className="reader-toolbar__title"><strong>Document preview</strong></div><div className="reader-toolbar__pages"><button type="button" className="icon-button" onClick={() => setPageNumber((page) => Math.max(1, page - 1))} disabled={nativeFallback || pageNumber <= 1} aria-label="Previous page"><CaretLeft size={18} /></button><span>{nativeFallback ? 'Native preview' : `${pageNumber} / ${numPages || '—'}`}</span><button type="button" className="icon-button" onClick={() => setPageNumber((page) => Math.min(numPages || page, page + 1))} disabled={nativeFallback || !numPages || pageNumber >= numPages} aria-label="Next page"><CaretRight size={18} /></button></div><div className="reader-toolbar__actions"><button type="button" className="icon-button" onClick={() => setScale((value) => Math.max(.6, value - .1))} disabled={nativeFallback} aria-label="Zoom out"><MagnifyingGlassMinus size={18} /></button><button type="button" className="icon-button" onClick={() => setScale((value) => Math.min(2.5, value + .1))} disabled={nativeFallback} aria-label="Zoom in"><MagnifyingGlassPlus size={18} /></button><a href={fileUrl} download={getPdfFileName()} className="icon-button reader-download" aria-label="Download PDF"><DownloadSimple size={18} /></a><a href={fileUrl} target="_blank" rel="noreferrer" className="icon-button" aria-label="Open in new tab"><ArrowSquareOut size={18} /></a><button type="button" className="icon-button" onClick={onClose} aria-label="Close preview"><X size={18} /></button></div></header><div className={`reader-viewport app-scrollbar ${nativeFallback ? 'reader-viewport--native' : ''}`}>{nativeFallback ? <div className="native-pdf-preview"><p className="native-pdf-notice">Using your browser’s built-in PDF viewer.</p><iframe className="native-pdf-frame" src={fileUrl} title="Document preview" /></div> : <>{loading && <div className="reader-status" role="status">Preparing document…</div>}<Document file={fileUrl} onLoadSuccess={({ numPages: pages }) => { setNumPages(pages); setLoading(false); }} onLoadError={() => { setLoading(false); setNativeFallback(true); }} onLoadProgress={() => setLoading(true)}><Page pageNumber={pageNumber} scale={scale} renderAnnotationLayer={false} renderTextLayer={false} className="reader-page" onRenderError={() => { setLoading(false); setNativeFallback(true); }} /></Document></>}</div></section></div>;
};

export default NotesViewer;
