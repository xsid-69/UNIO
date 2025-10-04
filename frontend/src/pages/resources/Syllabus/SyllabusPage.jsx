import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

// react-pdf imports (top-level)
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
import Spinner from '../../../components/Spinner';

const SyllabusPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // PDF viewer state
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [pdfAutoOpened, setPdfAutoOpened] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [pageRendering, setPageRendering] = useState(false);

  // Watermark text state (updates to include timestamp)
  const [watermarkText, setWatermarkText] = useState('');

  const handleGoBack = () => navigate(-1);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const branchParam = (user && user.branch) || null;
        const url = branchParam
          ? `${import.meta.env.VITE_BACKEND_URL}/api/resources/syllabus?branch=${encodeURIComponent(branchParam)}`
          : `${import.meta.env.VITE_BACKEND_URL}/api/resources/syllabus`;

        const res = await axios.get(url);
        if (res.data && res.data.files) setFiles(res.data.files);
        else setFiles([]);
      } catch (err) {
        console.error('Failed to fetch syllabus files', err);
        setError('Failed to load syllabus');
        toast.error('Failed to load syllabus files');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [user]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setDocLoading(false);
  };

  const onDocumentLoadError = (err) => {
    console.error('PDF document load error', err);
    setPdfLoadError(true);
    setDocLoading(false);
    toast.error('Unable to load PDF preview. Opening in new tab.');
  };

  const onPageRenderSuccess = () => {
    setPageRendering(false);
  };

  // When preview fails, auto-open the PDF in a new tab once (avoid repeated popups)
  useEffect(() => {
    if (pdfLoadError && selectedFile && !pdfAutoOpened) {
      try {
        window.open(selectedFile.url, '_blank', 'noopener,noreferrer');
        setPdfAutoOpened(true);
        toast.info('Opened PDF in a new tab');
      } catch (e) {
        console.warn('Auto-open failed', e);
      }
    }
  }, [pdfLoadError, selectedFile, pdfAutoOpened]);

  // Watermark updater: create watermark text containing user info + timestamp
  useEffect(() => {
    const buildText = () => {
      const id = (user && (user.name || user.email)) || 'UNIO';
      const ts = new Date().toLocaleString();
      return `${id} • ${ts}`;
    };

    setWatermarkText(buildText());
    const iv = setInterval(() => setWatermarkText(buildText()), 15000); // update every 15s
    return () => clearInterval(iv);
  }, [user]);

  // Prevent certain keys (Ctrl+P, Ctrl+S, F12, Ctrl+Shift+I) while viewer is open
  useEffect(() => {
    const handler = (e) => {
      if (!selectedFile) return;
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
      // Block Print, Save, DevTools
      if (ctrlKey && (e.key === 'p' || e.key === 's')) {
        e.preventDefault();
        toast.info('This action is disabled while viewing protected content');
      }
      if (e.key === 'F12' || (ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i')) {
        e.preventDefault();
        toast.info('This action is disabled while viewing protected content');
      }
      // Prevent PrintScreen cannot be blocked reliably
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedFile]);

  // Watermark overlay component (renders a grid of rotated watermark texts)
  const WatermarkOverlay = ({ text }) => {
    if (!text) return null;
    const rows = 6;
    const cols = 4;
    const items = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const key = `wm-${r}-${c}`;
        const top = (r / rows) * 100 + Math.random() * 6 - 3; // slight jitter
        const left = (c / cols) * 100 + Math.random() * 10 - 5;
        const size = 20 + (Math.abs((r - rows / 2)) + Math.abs((c - cols / 2))) * 1; // vary size
        items.push(
          <div
            key={key}
            style={{
              position: 'absolute',
              top: `${top}%`,
              left: `${left}%`,
              transform: 'translate(-50%, -50%) rotate(-25deg)',
              opacity: 0.08,
              color: '#ffffff',
              fontSize: `${size}px`,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              mixBlendMode: 'normal',
            }}
          >
            {text}
          </div>
        );
      }
    }

    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: 60, pointerEvents: 'none' }} aria-hidden>
        {items}
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-start mb-6">
        <Link to="#" onClick={handleGoBack} className="text-gray-400">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="ml-4 text-2xl font-semibold">Syllabus</h1>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-gray-400">
          <Spinner size={1.6} subtle />
          <span>Loading syllabus...</span>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && files.length === 0 && (
        <p className="text-gray-400">No syllabus files found for your branch.</p>
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {files.map((f) => (
          <div key={f.filePath || f.name} className="border rounded p-3 bg-white/5">
            <div className="font-medium text-sm mb-2 text-white">{f.name}</div>
            {f.url || f.filePath ? (
              <button
                onClick={async () => {
                  setPdfLoadError(false);
                  try {
                    // Request proxied file URL from backend so react-pdf can fetch same-origin
                    const qp = f.filePath ? `filePath=${encodeURIComponent(f.filePath)}` : `url=${encodeURIComponent(f.url)}`;
                    const proxyRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/resources/syllabus/file?${qp}`, { responseType: 'blob' });
                    // create object URL from blob and set as selectedFile.url
                    const blob = new Blob([proxyRes.data], { type: proxyRes.headers['content-type'] || 'application/pdf' });
                    const objectUrl = URL.createObjectURL(blob);
                    setSelectedFile({ ...f, url: objectUrl, _proxied: true });
                    // reset page/viewer state
                    setNumPages(null);
                    setPageNumber(1);
                    setDocLoading(true);
                    setPageRendering(true);
                  } catch (err) {
                    console.error('Failed to load proxied file', err);
                    toast.error('Failed to load preview; opening in new tab');
                    // Fallback: open original URL in new tab
                    if (f.url) window.open(f.url, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="text-[#13c4a3] underline"
              >
                Open PDF
              </button>
            ) : (
              <span className="text-gray-400">No preview available</span>
            )}
          </div>
        ))}
      </div>

      {selectedFile && (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">{selectedFile.name}</div>
            <div className="flex items-center gap-2">
              <a href={selectedFile.url} target="_blank" rel="noreferrer" className="text-sm text-teal-400 px-3 py-1 rounded bg-transparent border border-transparent hover:underline">Open in new tab</a>
              <a href={selectedFile.url} download className="text-sm text-gray-200 px-3 py-1 rounded bg-gray-700">Download</a>
              <button
                onClick={() => {
                  // cleanup object URL if proxied
                  try {
                    if (selectedFile && selectedFile._proxied && selectedFile.url) {
                      URL.revokeObjectURL(selectedFile.url);
                    }
                  } catch (e) {
                    // ignore
                  }
                  setSelectedFile(null);
                  setPdfLoadError(false);
                  setPdfAutoOpened(false);
                }}
                className="text-sm text-gray-300 bg-gray-700 px-3 py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>

          <div className="w-full h-[70vh] bg-white rounded overflow-hidden p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3 gap-2">
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-gray-800 rounded text-sm" onClick={() => setPageNumber(p => Math.max(1, p - 1))}>Prev</button>
                <div className="text-sm text-gray-300">Page</div>
                <input type="number" min={1} max={numPages || 1} value={pageNumber} onChange={(e) => setPageNumber(Number(e.target.value) || 1)} className="w-14 text-center rounded bg-gray-700 px-2 py-1 text-white text-sm" />
                <div className="text-sm text-gray-400">/ {numPages || '-'}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-gray-800 rounded text-sm" onClick={() => setScale(s => Math.max(0.5, +(s - 0.1).toFixed(2)))}>-</button>
                <div className="text-sm text-gray-300">Zoom</div>
                <button className="px-3 py-1 bg-gray-800 rounded text-sm" onClick={() => setScale(s => Math.min(2.25, +(s + 0.1).toFixed(2)))}>+</button>
              </div>
            </div>

            <div onContextMenu={(e) => { if (selectedFile) e.preventDefault(); }} className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center relative">
              <WatermarkOverlay text={watermarkText} />
              {!pdfLoadError ? (
                <div style={{ position: 'relative', zIndex: 10 }}>
                  {/* show spinner overlay while document or page is loading/rendering */}
                  {(docLoading || pageRendering) && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
                      <Spinner size={2.2} />
                    </div>
                  )}
                  <Document
                    file={selectedFile.url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    onLoadProgress={() => { setDocLoading(true); }}
                  >
                    <div className={`${pageRendering ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'} transition-all duration-300 ease-in-out`}> 
                      <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        onRenderSuccess={onPageRenderSuccess}
                        onRenderError={(err) => { console.error('Page render error', err); setPageRendering(false); }}
                        onLoadError={(err) => { console.error('Page load error', err); setPageRendering(false); }}
                        renderAnnotationLayer={false}
                      />
                    </div>
                  </Document>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-600 mb-2">Preview not available due to browser restrictions.</p>
                  <a href={selectedFile.url} target="_blank" rel="noreferrer" className="text-teal-400 underline">Open PDF in new tab</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusPage;
