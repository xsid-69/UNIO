import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Download, ArrowLeft, ZoomIn, ZoomOut, RotateCw, Home, Maximize2, Minimize2, RefreshCw, Eye, FileText, MoreVertical, X } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';



const ResourcesViewer = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    fetchNotesForSubject();
  }, [subjectId]);

  const fetchNotesForSubject = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:3000/api/notes/subject/${encodeURIComponent(subjectId)}`);

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
    setIframeLoading(true);
    setIframeError(false);
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

  const refreshIframe = () => {
    setIframeLoading(true);
    setIframeError(false);
    const iframe = document.querySelector('.pdf-iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  // Render loading state
  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <div className="text-lg text-white">Loading notes...</div>
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

  // Render empty state
  const renderEmptyState = () => (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-r border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          <h2 className="text-lg font-semibold text-white">Available Notes</h2>
          <div className="ml-auto text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">0</div>
        </div>
        <div className="text-center text-gray-400 mt-8">
          <FileText size={48} className="mx-auto mb-4 text-gray-600" />
          <div className="text-sm">No PDFs available</div>
          <div className="text-xs mt-2">Upload PDFs to see them here</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-white mb-4">No PDFs Available</h2>
          <p className="text-gray-400 mb-6">
            There are no PDF documents available for this subject yet.
            Upload PDF files to make them available for viewing.
          </p>
          <div className="bg-gray-800 rounded-lg p-4 text-left mb-6">
            <h3 className="text-white font-semibold mb-2">Current Status:</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Subject: {subjectId}</li>
              <li>• Status: Ready for PDF uploads</li>
              <li>• PDFs available: 0</li>
            </ul>
          </div>
          <button
            onClick={() => navigate('/subjects')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Subjects
          </button>
        </div>
      </div>
    </div>
  );

  // Render PDF viewer
  const renderPdfViewer = () => (
    <div className="flex-1 flex flex-col">
      {/* PDF Controls */}
      <div className="bg-gradient-to-r from-[#0a0a0a] to-[#111111] border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <FileText className="text-blue-400" size={20} />
              <h3 className="text-lg font-medium truncate">{selectedNote.title}</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
              <Eye size={12} />
              PDF Viewer
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshIframe}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
              title="Refresh PDF"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              {isFullscreen ? "Exit" : "Fullscreen"}
            </button>
            <button
              onClick={() => handleDownload(selectedNote.pdfUrl, selectedNote.title)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
              title="Download PDF"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className={`flex-1 ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''} transition-all duration-300`}>
        <div className={`${isFullscreen ? 'h-full' : 'h-full overflow-auto'} bg-gradient-to-br from-gray-900 to-gray-800 p-4`}>
          <div className={`relative ${isFullscreen ? 'h-full' : 'max-w-6xl mx-auto'}`}>
            {iframeLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <div className="text-lg text-white">Loading PDF...</div>
                  <div className="text-sm text-gray-400 mt-2">Please wait while we load your document</div>
                </div>
              </div>
            )}

            {iframeError && (
              <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600">
                <div className="text-center max-w-md mx-auto p-8">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-bold text-white mb-2">Failed to Load PDF</h3>
                  <p className="text-gray-400 mb-6">
                    The PDF couldn't be loaded. This might be due to network issues or the file might be temporarily unavailable.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={refreshIframe}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <RefreshCw size={16} />
                      Try Again
                    </button>
                    <button
                      onClick={() => handleDownload(selectedNote.pdfUrl, selectedNote.title)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Download size={16} />
                      Download Instead
                    </button>
                  </div>
                </div>
              </div>
            )}

            <iframe
              key={selectedNote.pdfUrl}
              src={`${selectedNote.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&spellcheck=0`}
              className="pdf-iframe w-full h-full min-h-[600px] border-0 rounded-lg bg-white shadow-2xl"
              title={selectedNote.title}
              onLoad={() => {
                setIframeLoading(false);
                setIframeError(false);
              }}
              onError={() => {
                setIframeLoading(false);
                setIframeError(true);
              }}
              allow="fullscreen"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render select note state
  const renderSelectNoteState = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center text-gray-400">
        <div className="text-xl mb-2">Select a note to view</div>
        <div className="text-sm">Choose a note from the sidebar to start reading</div>
      </div>
    </div>
  );

  return (
    <div className="h-[90vh] overflow-y-auto bg-[#060010] scrollbar-hide text-white">
      {/* Header */}
      <div className="bg-[#0a0a0a] border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/subjects')}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold capitalize">{subjectId} Notes</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              {notes.length} note{notes.length !== 1 ? 's' : ''} available
            </div>
            <button
              onClick={() => setSidebarVisible(!sidebarVisible)}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors"
              title={sidebarVisible ? "Hide Notes" : "Show Notes"}
            >
              {sidebarVisible ? <X size={20} /> : <MoreVertical size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)] relative">
        {/* Collapsible Sidebar */}
        {sidebarVisible && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarVisible(false)}
            />

            {/* Sidebar */}
            <div className={`w-80 bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-r border-gray-800 overflow-y-auto shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
              sidebarVisible ? 'translate-x-0' : '-translate-x-full'
            }`}>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <h2 className="text-lg font-semibold text-white">Available Notes</h2>
                  <div className="ml-auto text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                    {notes.length}
                  </div>
                </div>
                <div className="space-y-3">
                  {notes.map((note, index) => (
                    <div
                      key={note._id || index}
                      className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 transform hover:scale-[1.02] ${
                        selectedNote && (selectedNote._id === note._id || selectedNote.title === note.title)
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-400 shadow-lg shadow-blue-500/25'
                          : 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-500/10'
                      }`}
                      onClick={() => {
                        handleNoteSelect(note);
                        setSidebarVisible(false); // Hide sidebar after selection
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          selectedNote && (selectedNote._id === note._id || selectedNote.title === note.title)
                            ? 'bg-blue-500/20'
                            : 'bg-gray-700/50 group-hover:bg-gray-600/50'
                        }`}>
                          <FileText size={16} className={`${
                            selectedNote && (selectedNote._id === note._id || selectedNote.title === note.title)
                              ? 'text-blue-400'
                              : 'text-gray-400 group-hover:text-gray-300'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium truncate text-sm ${
                            selectedNote && (selectedNote._id === note._id || selectedNote.title === note.title)
                              ? 'text-white'
                              : 'text-gray-200 group-hover:text-white'
                          }`}>
                            {note.title}
                          </div>
                          {note.description && (
                            <div className={`text-xs mt-2 line-clamp-2 ${
                              selectedNote && (selectedNote._id === note._id || selectedNote.title === note.title)
                                ? 'text-blue-100'
                                : 'text-gray-400 group-hover:text-gray-300'
                            }`}>
                              {note.description}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              selectedNote && (selectedNote._id === note._id || selectedNote.title === note.title)
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-gray-700/50 text-gray-500 group-hover:bg-gray-600/50 group-hover:text-gray-400'
                            }`}>
                              {note.semester} Semester
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(note.pdfUrl, note.title);
                              }}
                              className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                                selectedNote && (selectedNote._id === note._id || selectedNote.title === note.title)
                                  ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                                  : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-gray-300'
                              }`}
                              title="Download PDF"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Content Area */}
        <div className="flex-1">
          {loading ? renderLoadingState() :
           error ? renderErrorState() :
           notes.length === 0 ? (
             <div className="flex h-full">
               {/* Empty Sidebar (when collapsed) */}
               {sidebarVisible && (
                 <div className="w-80 bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-r border-gray-800 p-4">
                   <div className="flex items-center gap-2 mb-6">
                     <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                     <h2 className="text-lg font-semibold text-white">Available Notes</h2>
                     <div className="ml-auto text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">0</div>
                   </div>
                   <div className="text-center text-gray-400 mt-8">
                     <FileText size={48} className="mx-auto mb-4 text-gray-600" />
                     <div className="text-sm">No PDFs available</div>
                     <div className="text-xs mt-2">Upload PDFs to see them here</div>
                   </div>
                 </div>
               )}

               {/* Empty Content */}
               <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                 <div className="text-center max-w-md mx-auto p-8">
                   <div className="text-gray-400 text-6xl mb-4">📄</div>
                   <h2 className="text-2xl font-bold text-white mb-4">No PDFs Available</h2>
                   <p className="text-gray-400 mb-6">
                     There are no PDF documents available for this subject yet.
                     Upload PDF files to make them available for viewing.
                   </p>
                   <div className="bg-gray-800 rounded-lg p-4 text-left mb-6">
                     <h3 className="text-white font-semibold mb-2">Current Status:</h3>
                     <ul className="text-gray-400 text-sm space-y-1">
                       <li>• Subject: {subjectId}</li>
                       <li>• Status: Ready for PDF uploads</li>
                       <li>• PDFs available: 0</li>
                     </ul>
                   </div>
                   <button
                     onClick={() => navigate('/subjects')}
                     className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                   >
                     <ArrowLeft size={20} />
                     Back to Subjects
                   </button>
                 </div>
               </div>
             </div>
           ) :
           selectedNote ? renderPdfViewer() : renderSelectNoteState()}
        </div>
      </div>
    </div>
  );
};

export default ResourcesViewer;
