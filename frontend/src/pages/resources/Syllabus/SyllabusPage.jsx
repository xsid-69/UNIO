import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowSquareOut, CaretLeft, CaretRight, DownloadSimple, FilePdf, MagnifyingGlassMinus, MagnifyingGlassPlus, X } from '@phosphor-icons/react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/ui/PageHeader';
import StatePanel from '../../../components/ui/StatePanel';
import { createValidatedPdfBlob, getDirectPdfUrl, getPdfFileName, PDF_WORKER_SRC } from '../../../lib/pdf';

pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;

const getFileId = (file) => file?.filePath || file?.url || file?.name || '';
const isAvailable = (file) => Boolean(file?.filePath || file?.url);

const SyllabusPage = () => {
  const { user } = useSelector((state) => state.auth);
  const objectUrlRef = useRef('');
  const selectedIdRef = useRef('');
  const previewRequestRef = useRef(null);
  const filesRequestIdRef = useRef(0);
  const mountedRef = useRef(false);
  const viewportRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [openingId, setOpeningId] = useState('');
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(760);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [renderMode, setRenderMode] = useState('pdfjs');
  const [previewAttempt, setPreviewAttempt] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = '';
  }, []);

  const openFile = useCallback(async (file, { force = false } = {}) => {
    if (!isAvailable(file)) return;
    const id = getFileId(file);
    if (!force && selectedIdRef.current === id && objectUrlRef.current) return;
    if (!force && previewRequestRef.current?.id === id) return previewRequestRef.current.promise;

    previewRequestRef.current?.controller.abort();
    const controller = new AbortController();
    const request = { id, controller, promise: null };
    previewRequestRef.current = request;
    revokeObjectUrl();
    selectedIdRef.current = id;

    if (mountedRef.current) {
      setSelectedFile({ ...file, previewUrl: '' });
      setOpeningId(id);
      setPdfError('');
      setRenderMode('pdfjs');
      setDocumentLoading(true);
      setNumPages(0);
      setPageNumber(1);
      setScale(1);
    }

    request.promise = axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/resources/syllabus/file`, {
      params: file.filePath ? { filePath: file.filePath } : { url: file.url },
      responseType: 'arraybuffer',
      signal: controller.signal,
    }).then(async (response) => {
      const blob = await createValidatedPdfBlob(response.data);
      if (!mountedRef.current || previewRequestRef.current !== request) return;
      const objectUrl = URL.createObjectURL(blob);
      objectUrlRef.current = objectUrl;
      setSelectedFile({ ...file, previewUrl: objectUrl });
      setPreviewAttempt((attempt) => attempt + 1);
    }).catch((requestError) => {
      if (requestError.code === 'ERR_CANCELED' || !mountedRef.current || previewRequestRef.current !== request) return;
      const directSource = getDirectPdfUrl(file.url || '');
      setDocumentLoading(false);
      if (directSource) {
        setSelectedFile({ ...file, previewUrl: directSource });
        setRenderMode('native');
        setPdfError('The enhanced preview was unavailable, so UNIO opened the original PDF in your browser viewer.');
      } else {
        setRenderMode('error');
        setPdfError(requestError.message || 'The syllabus PDF could not be prepared.');
        toast.error('The PDF preview could not be prepared.');
      }
    }).finally(() => {
      if (previewRequestRef.current === request) {
        previewRequestRef.current = null;
        if (mountedRef.current) setOpeningId('');
      }
    });

    return request.promise;
  }, [revokeObjectUrl]);

  const closePreview = useCallback(() => {
    previewRequestRef.current?.controller.abort();
    previewRequestRef.current = null;
    selectedIdRef.current = '';
    revokeObjectUrl();
    setSelectedFile(null);
    setPdfError('');
    setRenderMode('pdfjs');
    setDocumentLoading(false);
  }, [revokeObjectUrl]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      previewRequestRef.current?.controller.abort();
      previewRequestRef.current = null;
      revokeObjectUrl();
    };
  }, [revokeObjectUrl]);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = filesRequestIdRef.current + 1;
    filesRequestIdRef.current = requestId;
    setLoading(true);
    setError('');

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/resources/syllabus`, {
      params: user?.branch ? { branch: user.branch } : {},
      signal: controller.signal,
    }).then((response) => {
      if (!mountedRef.current || filesRequestIdRef.current !== requestId) return;
      const list = Array.isArray(response.data?.files) ? response.data.files : [];
      setFiles(list);
      const firstAvailable = list.find(isAvailable);
      if (firstAvailable) void openFile(firstAvailable);
      else closePreview();
    }).catch((requestError) => {
      if (requestError.code !== 'ERR_CANCELED' && mountedRef.current && filesRequestIdRef.current === requestId) {
        setError(requestError.response?.status === 401 ? 'Sign in to view your branch syllabus.' : 'The syllabus library could not be loaded.');
      }
    }).finally(() => {
      if (mountedRef.current && filesRequestIdRef.current === requestId) setLoading(false);
    });

    return () => controller.abort();
  }, [closePreview, openFile, reloadKey, user?.branch]);

  useEffect(() => {
    if (!viewportRef.current || !selectedFile) return undefined;
    const observer = new ResizeObserver(([entry]) => setViewportWidth(entry.contentRect.width));
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [selectedFile]);

  const retryPreview = () => {
    if (selectedFile) void openFile(selectedFile, { force: true });
  };
  const switchToNativeFallback = (message) => {
    setDocumentLoading(false);
    setPdfError(message);
    setRenderMode('native');
    setNumPages(0);
  };
  const watermark = user?.name || user?.email || 'UNIO student';
  const nativeMode = renderMode === 'native';
  const selectedDownloadUrl = selectedFile?.previewUrl || getDirectPdfUrl(selectedFile?.url || '');

  return (
    <div>
      <PageHeader back eyebrow={user?.branch || 'Course documents'} title="Syllabus" description="Open the official course scope for your branch and keep it beside your study plan." />
      {loading ? <StatePanel type="loading" title="Loading your syllabus" description="Finding the documents available for your branch." /> : error ? <StatePanel type="error" title="Syllabus unavailable" description={error} action={<button type="button" className="btn-secondary" onClick={() => setReloadKey((key) => key + 1)}>Try again</button>} /> : !files.length ? <StatePanel title="No syllabus found" description={user?.branch ? `No syllabus has been published for ${user.branch}.` : 'Add your branch to your profile so UNIO can find the right syllabus.'} /> : (
        <section className="syllabus-grid" aria-label="Available syllabus files">
          {files.map((file) => {
            const id = getFileId(file);
            const available = isAvailable(file);
            const selected = getFileId(selectedFile) === id;
            return <article key={id} className="syllabus-card" data-reveal><span className="bento-card__icon"><FilePdf size={25} weight="duotone" /></span><div><h2>{file.name || 'Syllabus PDF'}</h2><p>{available ? 'PDF document ready to preview.' : 'A preview source has not been added yet.'}</p></div><button type="button" className="btn-secondary" onClick={() => openFile(file)} disabled={!available || openingId === id} aria-pressed={selected}>{openingId === id ? 'Preparing…' : selected ? 'Selected' : 'Open document'}</button></article>;
          })}
        </section>
      )}

      {selectedFile && (
        <section className="syllabus-reader" aria-labelledby="syllabus-document-title">
          <header className="reader-toolbar">
            <div className="reader-toolbar__title"><FilePdf size={20} weight="duotone" /><strong id="syllabus-document-title">{selectedFile.name}</strong></div>
            <div className="reader-toolbar__pages"><button type="button" className="icon-button" onClick={() => setPageNumber((page) => Math.max(1, page - 1))} disabled={nativeMode || pageNumber <= 1} aria-label="Previous page"><CaretLeft size={18} /></button><span>{nativeMode ? 'Native preview' : `${pageNumber} / ${numPages || '—'}`}</span><button type="button" className="icon-button" onClick={() => setPageNumber((page) => Math.min(numPages || page, page + 1))} disabled={nativeMode || !numPages || pageNumber >= numPages} aria-label="Next page"><CaretRight size={18} /></button></div>
            <div className="reader-toolbar__actions">
              <button type="button" className="icon-button" onClick={() => setScale((value) => Math.max(.6, +(value - .15).toFixed(2)))} disabled={nativeMode || scale <= .6} aria-label="Zoom out"><MagnifyingGlassMinus size={18} /></button>
              <span className="reader-zoom">{nativeMode ? 'Auto' : `${Math.round(scale * 100)}%`}</span>
              <button type="button" className="icon-button" onClick={() => setScale((value) => Math.min(2.4, +(value + .15).toFixed(2)))} disabled={nativeMode || scale >= 2.4} aria-label="Zoom in"><MagnifyingGlassPlus size={18} /></button>
              {selectedDownloadUrl && <a className="icon-button reader-download" href={selectedDownloadUrl} download={getPdfFileName(selectedFile.name)} aria-label="Download PDF"><DownloadSimple size={18} /></a>}
              {selectedDownloadUrl && <a className="icon-button" href={selectedDownloadUrl} target="_blank" rel="noreferrer" aria-label="Open PDF in a new tab"><ArrowSquareOut size={18} /></a>}
              <button type="button" className="icon-button" onClick={closePreview} aria-label="Close syllabus preview"><X size={18} /></button>
            </div>
          </header>
          <div className={`reader-viewport app-scrollbar ${nativeMode ? 'reader-viewport--native' : ''}`} ref={viewportRef}>
            {renderMode === 'error' ? <StatePanel compact type="error" title="Preview unavailable" description={pdfError} action={<div className="state-actions"><button type="button" className="btn-secondary" onClick={retryPreview}>Retry preview</button>{selectedDownloadUrl && <a className="btn-ghost" href={selectedDownloadUrl} download={getPdfFileName(selectedFile.name)}>Download PDF</a>}</div>} /> : nativeMode && selectedFile.previewUrl ? <div className="native-pdf-preview"><p className="native-pdf-notice">{pdfError || 'Using your browser’s built-in PDF viewer.'}</p><iframe className="native-pdf-frame" src={selectedFile.previewUrl} title={`${selectedFile.name} PDF`} /></div> : (
              <>
                <div className="watermark-grid" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index}>{watermark} · UNIO</span>)}</div>
                {documentLoading && <div className="reader-status" role="status"><span className="is-spinning"><FilePdf size={25} /></span><span>Preparing and validating syllabus…</span></div>}
                {selectedFile.previewUrl && <Document key={`${selectedIdRef.current}-${previewAttempt}`} file={selectedFile.previewUrl} onLoadSuccess={({ numPages: pages }) => { setNumPages(pages); setDocumentLoading(false); }} onLoadError={() => switchToNativeFallback('The enhanced renderer could not open this syllabus, so UNIO switched to your browser viewer.')} loading={null} error={null}>
                  <Page pageNumber={pageNumber} scale={scale} width={Math.max(260, Math.min(viewportWidth - 48, 960))} renderAnnotationLayer={false} renderTextLayer={false} className="reader-page" onRenderError={() => switchToNativeFallback('This page could not be drawn by the enhanced renderer, so UNIO switched to your browser viewer.')} />
                </Document>}
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default SyllabusPage;
