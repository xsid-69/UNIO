import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Download, ArrowLeft, ZoomIn, ZoomOut, RotateCw, Home, Maximize2, Minimize2, RefreshCw, Eye, FileText, MoreVertical, X } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;

const ResourcesViewer = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // PDF Viewer State
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchNotesForSubject();
  }, [subjectId]);

  // Reset PDF state when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setPageNumber(1);
      setNumPages(null);
      setScale(1.0);
      setPdfLoading(true);
    }
  }, [selectedNote]);

  // Handle Container Resize to fit PDF width
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [sidebarVisible, isFullscreen, selectedNote]); // Re-measure when layout changes

  const fetchNotesForSubject = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notes/subject/${encodeURIComponent(subjectId)}`);

      if (response.data.success) {
        setNotes(response.data.notes);
        if (response.data.notes.length > 0) {
          setSelectedNote(response.data.notes[0]);
        }
      } else {
        setError(response.data.message || 'Failed to fetch notes');
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      if (err.response?.status === 401) {
        setError('Please log in to view notes');
      } else if (err.response?.status === 404) {
        setError('Subject not found or no notes available');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch notes for this subject');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    if (window.innerWidth < 1024) {  // Mobile breakpoint
      setSidebarVisible(false);
    }
  };

  const handleDownload = (pdfUrl, title) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfLoading(false);
  };

  // Render loading state
  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <div className="text-lg text-white">Loading content...</div>
      </div>
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">Error: {error}</div>
        <button
          onClick={() => navigate('/subjects')}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Subjects
        </button>
      </div>
    </div>
  );

  // Render PDF viewer
  const renderPdfViewer = () => (
    <div className="flex-1 flex flex-col h-full bg-[#1a1a1a]">
      {/* PDF Controls */}
      <div className="bg-[#0a0a0a] border-b border-gray-800 p-2 md:p-4 flex flex-col md:flex-row items-center justify-between gap-3 sticky top-0 z-20 shadow-md">
        {/* Left: Title */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="text-blue-400 flex-shrink-0" size={20} />
            <h3 className="text-lg font-medium truncate text-white">{selectedNote.title}</h3>
          </div>
        </div>

        {/* Center: Pagination */}
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            className="p-1.5 hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-300 px-2 min-w-[60px] text-center">
            {pageNumber} / {numPages || '--'}
          </span>
          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
            className="p-1.5 hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 md:gap-2">
           <button
            onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => setScale(prev => Math.min(prev + 0.2, 3.0))}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          
          <div className="w-px h-6 bg-gray-700 mx-1"></div>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white hidden md:block" // Hidden on really small screens if crowded
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={() => handleDownload(selectedNote.pdfUrl, selectedNote.title)}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 text-white text-sm font-medium transition-colors"
            title="Download PDF"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* PDF Content Area */}
      <div 
        className={`flex-1 overflow-auto bg-[#1a1a1a] flex justify-center relative ${isFullscreen ? 'fixed inset-0 z-50 pt-16' : ''}`}
        ref={containerRef}
      >
        <div className="py-4 md:py-8 min-h-full w-full flex justify-center">
          <Document
            file={`${import.meta.env.VITE_BACKEND_URL}/api/notes/file?url=${encodeURIComponent(selectedNote.pdfUrl)}`}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => {
              console.error("PDF Load Error:", err);
              // Set a state or just let the user see it in the UI
              window.alert(`PDF Error: ${err.message}`); // proactive alert for the user
            }}
            error={(err) => ( // React-pdf error render prop can take a function sometimes, or we rely on the component state if we managed it. 
               // actually Document 'error' prop is a React node, not a function receiving the error. 
               // We need to capture the error in state to show it.
               <div className="flex flex-col items-center justify-center p-12 text-center max-w-md">
                 <div className="text-red-500 text-4xl mb-4">⚠️</div>
                 <h3 className="text-xl font-bold text-white mb-2">Unavailable</h3>
                 <p className="text-gray-400">Unable to load this document.</p>
                 <p className="text-red-400 text-sm mt-2 font-mono bg-black/50 p-2 rounded">{err ? err.message : 'Unknown error'}</p>
                 <button 
                  onClick={() => handleDownload(selectedNote.pdfUrl, selectedNote.title)}
                  className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
                 >
                   Download File
                 </button>
               </div>
            )}
            className="flex flex-col items-center shadow-2xl"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              width={containerWidth ? Math.min(containerWidth * 0.95, 1000) : undefined} // Responsive width
              className="bg-white shadow-lg mb-4"
              renderAnnotationLayer={false}
              renderTextLayer={false} // Disable text layer for better performance/less visual clutter if fonts missing
            />
          </Document>
        </div>
      </div>
    </div>
  );

  const renderSelectNoteState = () => (
    <div className="flex-1 flex items-center justify-center bg-[#060010]">
      <div className="text-center text-gray-400 p-8">
        <FileText size={64} className="mx-auto mb-4 text-gray-700" />
        <div className="text-xl mb-2 text-white">Select a document</div>
        <div className="text-sm text-gray-500">Choose a note from the sidebar to start reading</div>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#060010] flex flex-col text-white">
      {/* Subject Header (hidden in fullscreen) */}
      {!isFullscreen && (
        <div className="bg-[#0a0a0a] border-b border-gray-800 p-3 md:p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => navigate('/subjects')}
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors"
                title="Back to Subjects"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg md:text-2xl font-bold capitalize truncate max-w-[200px] md:max-w-none">{subjectId} Notes</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-400 hidden sm:block">
                {notes.length} note{notes.length !== 1 ? 's' : ''}
              </div>
              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors relative"
                title="Toggle Sidebar"
              >
                {sidebarVisible ? <X size={20} /> : <MoreVertical size={20} />}
                {!sidebarVisible && notes.length > 0 && (
                   <span className="absolute -top-1 -right-1 flex h-3 w-3">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                   </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div 
          className={`
            fixed md:static inset-y-0 left-0 z-30 w-80 
            bg-[#050505] border-r border-gray-800 
            transform transition-transform duration-300 ease-in-out
            ${sidebarVisible ? 'translate-x-0' : '-translate-x-full md:hidden'}
            flex flex-col
          `}
        >
           {/* Sidebar Header with Close button for mobile */}
           <div className="p-4 border-b border-gray-800 flex justify-between items-center md:hidden">
              <h2 className="font-semibold">Documents</h2>
              <button onClick={() => setSidebarVisible(false)} className="p-1 hover:bg-gray-800 rounded">
                <X size={20} />
              </button>
           </div>
           
           <div className="overflow-y-auto flex-1 p-3 space-y-2">
              {notes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No notes available</div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note._id}
                    onClick={() => handleNoteSelect(note)}
                    className={`
                      p-3 rounded-lg cursor-pointer border transition-all
                      ${selectedNote?._id === note._id 
                        ? 'bg-blue-900/20 border-blue-500/50' 
                        : 'bg-gray-900 border-gray-800 hover:border-gray-700'}
                    `}
                  >
                    <div className="font-medium text-sm truncate text-white">{note.title}</div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      <span>Sem: {note.semester}</span>
                      <span className="uppercase">{note.branch}</span>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>
        
        {/* Mobile Backdrop for Sidebar */}
        {sidebarVisible && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarVisible(false)}
          ></div>
        )}

        {/* Viewer Area */}
        <div className="flex-1 w-full bg-[#1a1a1a] relative flex flex-col">
           {loading ? renderLoadingState() :
            error ? renderErrorState() :
            notes.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-center p-8">
                 <div className="text-6xl mb-4">📂</div>
                 <h2 className="text-2xl font-bold mb-2">No Notes Found</h2>
                 <p className="text-gray-400">This subject doesn't have any materials yet.</p>
               </div>
            ) :
            selectedNote ? renderPdfViewer() : renderSelectNoteState()
           }
        </div>
      </div>
    </div>
  );
};

export default ResourcesViewer;
