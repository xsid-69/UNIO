import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowSquareOut, ArrowsIn, ArrowsOut, CaretLeft, CaretRight, DownloadSimple, FilePdf, List, MagnifyingGlassMinus, MagnifyingGlassPlus, X } from '@phosphor-icons/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { createValidatedPdfBlob, getDirectPdfUrl, getPdfFileName, getPdfProxyParams, PDF_WORKER_SRC } from '../lib/pdf';
import StatePanel from './ui/StatePanel';

pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;

const hasUsablePdf = (note) => typeof note?.pdfUrl === 'string' && note.pdfUrl.trim().length > 0;

const ResourcesViewer = () => {
  const { subjectId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const viewportRef = useRef(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(720);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [previewSource, setPreviewSource] = useState('');
  const [renderMode, setRenderMode] = useState('pdfjs');
  const [previewAttempt, setPreviewAttempt] = useState(0);

  const selectNote = useCallback((note) => {
    if (!hasUsablePdf(note)) {
      setSelectedNote(null);
      setPageNumber(1);
      setNumPages(0);
      setScale(1);
      setPdfError('');
      setPdfLoading(false);
      setPreviewSource('');
      return;
    }
    setSelectedNote(note);
    setPageNumber(1);
    setNumPages(0);
    setScale(1);
    setPreviewAttempt((attempt) => attempt + 1);
    setDrawerOpen(false);
  }, []);

  const fetchNotes = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notes/subject/${encodeURIComponent(subjectId)}`, { signal });
      const list = response.data?.success && Array.isArray(response.data.notes) ? response.data.notes : [];
      setNotes(list);
      selectNote(list.find(hasUsablePdf) || null);
      if (!response.data?.success) setError(response.data?.message || 'Notes could not be loaded.');
    } catch (requestError) {
      if (requestError.code !== 'ERR_CANCELED') setError(requestError.response?.status === 401 ? 'Sign in to view these notes.' : requestError.response?.data?.message || 'Notes could not be loaded.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [selectNote, subjectId]);

  useEffect(() => {
    const controller = new AbortController();
    fetchNotes(controller.signal);
    return () => controller.abort();
  }, [fetchNotes]);

  useEffect(() => {
    if (!selectedNote) return undefined;
    const controller = new AbortController();
    const source = selectedNote.pdfUrl.trim();
    const directSource = getDirectPdfUrl(source);
    const proxySource = `${import.meta.env.VITE_BACKEND_URL}/api/notes/file?${new URLSearchParams(getPdfProxyParams(source)).toString()}`;
    let objectUrl = '';
    let active = true;

    setPreviewSource('');
    setRenderMode('pdfjs');
    setPdfError('');
    setPdfLoading(true);
    setNumPages(0);

    const preparePreview = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notes/file`, {
          params: getPdfProxyParams(source),
          responseType: 'arraybuffer',
          signal: controller.signal,
        });
        const blob = await createValidatedPdfBlob(response.data);
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setPreviewSource(objectUrl);
      } catch (requestError) {
        if (!active || requestError.code === 'ERR_CANCELED') return;
        setPdfLoading(false);
        const fallbackSource = directSource || proxySource;
        if (fallbackSource) {
          setPreviewSource(fallbackSource);
          setRenderMode('native');
          setPdfError('The enhanced preview was unavailable, so UNIO opened the PDF in your browser viewer.');
        } else {
          setRenderMode('error');
          setPdfError(requestError.message || 'The PDF could not be prepared. You can still retry or download the source.');
        }
      }
    };

    void preparePreview();
    return () => {
      active = false;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [previewAttempt, selectedNote]);

  useEffect(() => {
    if (!viewportRef.current) return undefined;
    const observer = new ResizeObserver(([entry]) => setViewportWidth(entry.contentRect.width));
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [fullscreen, previewSource, selectedNote]);

  useEffect(() => {
    if (!fullscreen && !drawerOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') { setFullscreen(false); setDrawerOpen(false); }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [drawerOpen, fullscreen]);

  const usableNotes = useMemo(() => notes.filter(hasUsablePdf), [notes]);
  const subjectName = state?.subjectName || 'Subject notes';
  const selectedSource = selectedNote?.pdfUrl?.trim() || '';
  const directSource = getDirectPdfUrl(selectedSource);
  const proxyDownloadUrl = selectedSource ? `${import.meta.env.VITE_BACKEND_URL}/api/notes/file?${new URLSearchParams(getPdfProxyParams(selectedSource)).toString()}` : '';
  const downloadUrl = previewSource || directSource || proxyDownloadUrl;
  const nativeMode = renderMode === 'native';
  const retryPreview = () => setPreviewAttempt((attempt) => attempt + 1);
  const switchToNativeFallback = (message) => {
    setPdfLoading(false);
    setPdfError(message);
    setRenderMode('native');
    setNumPages(0);
  };

  if (loading) return <StatePanel type="loading" title="Loading study material" description="Finding the notes available for this subject." />;
  if (error) return <StatePanel type="error" title="Notes are unavailable" description={error} action={<div className="state-actions"><button type="button" className="btn-secondary" onClick={() => fetchNotes()}>Try again</button><button type="button" className="btn-ghost" onClick={() => navigate('/subjects')}>Back to subjects</button></div>} />;
  if (!notes.length) return <StatePanel title="No notes here yet" description="This subject does not have published study material yet." action={<button type="button" className="btn-secondary" onClick={() => navigate('/subjects')}>Back to subjects</button>} />;

  return (
    <section className={`reader-shell ${fullscreen ? 'reader-shell--fullscreen' : ''}`} aria-label={`${subjectName} document reader`}>
      <header className="reader-header">
        <div className="reader-header__lead">
          <button type="button" className="icon-button" onClick={() => navigate('/subjects')} aria-label="Back to subjects"><ArrowLeft size={20} /></button>
          <div><p className="context-label">{notes.length} {notes.length === 1 ? 'document' : 'documents'}</p><h1>{subjectName}</h1></div>
        </div>
        <button type="button" className="btn-secondary reader-list-button" onClick={() => setDrawerOpen(true)}><List size={19} /> Documents</button>
      </header>

      <div className="reader-workspace">
        <aside className={`reader-sidebar ${drawerOpen ? 'is-open' : ''}`} aria-label="Available documents">
          <div className="reader-sidebar__header"><div><p className="context-label">Library</p><h2>Documents</h2></div><button type="button" className="icon-button reader-sidebar__close" onClick={() => setDrawerOpen(false)} aria-label="Close document list"><X size={19} /></button></div>
          <div className="reader-sidebar__list app-scrollbar">
            {notes.map((note) => {
              const available = hasUsablePdf(note);
              const noteId = note._id || note.pdfUrl || note.title;
              return <button type="button" key={noteId} className={`document-item ${selectedNote === note ? 'is-active' : ''}`} onClick={() => selectNote(note)} aria-pressed={selectedNote === note} disabled={!available}><FilePdf size={22} weight="duotone" /><span><strong>{note.title}</strong><small>{available ? `${note.branch} · Semester ${note.semester}` : 'Preview unavailable'}</small></span></button>;
            })}
          </div>
        </aside>
        {drawerOpen && <button type="button" className="reader-scrim" onClick={() => setDrawerOpen(false)} aria-label="Close document list" />}

        <div className="reader-document">
          <div className="reader-toolbar" aria-label="PDF controls">
            <div className="reader-toolbar__title"><FilePdf size={20} weight="duotone" /><strong>{selectedNote?.title || 'No preview available'}</strong></div>
            <div className="reader-toolbar__pages">
              <button type="button" className="icon-button" onClick={() => setPageNumber((page) => Math.max(1, page - 1))} disabled={!selectedNote || nativeMode || pageNumber <= 1} aria-label="Previous page"><CaretLeft size={18} /></button>
              <span aria-live="polite">{nativeMode ? 'Native preview' : `${selectedNote ? pageNumber : '—'} / ${numPages || '—'}`}</span>
              <button type="button" className="icon-button" onClick={() => setPageNumber((page) => Math.min(numPages || page, page + 1))} disabled={nativeMode || !numPages || pageNumber >= numPages} aria-label="Next page"><CaretRight size={18} /></button>
            </div>
            <div className="reader-toolbar__actions">
              <button type="button" className="icon-button" onClick={() => setScale((value) => Math.max(.6, +(value - .15).toFixed(2)))} disabled={!selectedNote || nativeMode || scale <= .6} aria-label="Zoom out"><MagnifyingGlassMinus size={18} /></button>
              <span className="reader-zoom" aria-live="polite">{nativeMode ? 'Auto' : `${Math.round(scale * 100)}%`}</span>
              <button type="button" className="icon-button" onClick={() => setScale((value) => Math.min(2.4, +(value + .15).toFixed(2)))} disabled={!selectedNote || nativeMode || scale >= 2.4} aria-label="Zoom in"><MagnifyingGlassPlus size={18} /></button>
              {downloadUrl && <a className="icon-button reader-download" href={downloadUrl} download={getPdfFileName(selectedNote?.title)} aria-label="Download PDF"><DownloadSimple size={18} /></a>}
              {downloadUrl && <a className="icon-button" href={downloadUrl} target="_blank" rel="noreferrer" aria-label="Open PDF in a new tab"><ArrowSquareOut size={18} /></a>}
              <button type="button" className="icon-button reader-fullscreen" onClick={() => setFullscreen((value) => !value)} aria-label={fullscreen ? 'Exit full screen reader' : 'Open full screen reader'}>{fullscreen ? <ArrowsIn size={18} /> : <ArrowsOut size={18} />}</button>
            </div>
          </div>

          <div className={`reader-viewport app-scrollbar ${nativeMode ? 'reader-viewport--native' : ''}`} ref={viewportRef}>
            {!selectedNote ? <StatePanel compact title="No preview available" description="None of these notes currently has a usable PDF source." action={<button type="button" className="btn-secondary" onClick={() => navigate('/subjects')}>Back to subjects</button>} /> : renderMode === 'error' ? (
              <StatePanel compact type="error" title="Preview unavailable" description={pdfError} action={<div className="state-actions"><button type="button" className="btn-secondary" onClick={retryPreview}>Retry preview</button>{downloadUrl && <a className="btn-ghost" href={downloadUrl} download={getPdfFileName(selectedNote.title)}>Download PDF</a>}<button type="button" className="btn-ghost" onClick={() => usableNotes.length > 1 ? setDrawerOpen(true) : navigate('/subjects')}>{usableNotes.length > 1 ? 'Choose another document' : 'Back to subjects'}</button></div>} />
            ) : nativeMode && previewSource ? (
              <div className="native-pdf-preview"><p className="native-pdf-notice">{pdfError || 'Using your browser’s built-in PDF viewer.'}</p><iframe className="native-pdf-frame" src={previewSource} title={`${selectedNote.title} PDF`} /></div>
            ) : (
              <>
                {pdfLoading && <div className="reader-status" role="status"><span className="is-spinning"><FilePdf size={25} /></span><span>Preparing the document…</span></div>}
                {previewSource && <Document key={`${selectedNote._id || selectedNote.pdfUrl}-${previewAttempt}`} file={previewSource} onLoadSuccess={({ numPages: pages }) => { setNumPages(pages); setPdfLoading(false); }} onLoadError={() => switchToNativeFallback('The enhanced renderer could not open this PDF, so UNIO switched to your browser viewer.')} loading={null} error={null}>
                  <Page pageNumber={pageNumber} scale={scale} width={Math.max(260, Math.min(viewportWidth - 48, 960))} renderAnnotationLayer={false} renderTextLayer={false} className="reader-page" onRenderError={() => switchToNativeFallback('This page could not be drawn by the enhanced renderer, so UNIO switched to your browser viewer.')} />
                </Document>}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesViewer;
