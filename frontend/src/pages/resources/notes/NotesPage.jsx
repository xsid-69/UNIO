import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';
import SubjectsList from  '../../../components/SubjectsList'; // Import SubjectsList
import NotesViewer from '../../../components/NotesViewer';
import Spinner from '../../../components/Spinner';
import { useSelector } from 'react-redux';

const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7']; 
const NotesPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  // normalize admin check: prefer boolean isAdmin, fall back to role string for compatibility
  const isAdmin = user && typeof user.isAdmin === 'boolean' ? user.isAdmin : (user && user.role === 'admin');

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [selected, setSelected] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // State for new note creation
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteDescription, setNewNoteDescription] = useState('');
  const [newNoteSubject, setNewNoteSubject] = useState('');
  const [newNoteSemester, setNewNoteSemester] = useState('');
  const [newNoteBranch, setNewNoteBranch] = useState('');
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [showCreateNotePopup, setShowCreateNotePopup] = useState(false); // State to control popup visibility

  // State for PDF upload (Admin only)
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState('');
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleGoBack = () => navigate(-1);

  const fetchNotes = async () => {
    if (!user) {
      // If no user is logged in, redirect to login page
      alert('Please log in to view notes.');
      navigate('/login'); // Assuming '/login' is your login route
      return;
    }

    setLoading(true);
    try {
      const qp = new URLSearchParams();
      if (semester) qp.set('semester', semester);
      if (subject) qp.set('subject', subject);

      const res = await axios.get(`http://localhost:3000/api/notes?${qp.toString()}`, { withCredentials: true });
      if (res.data && res.data.notes) setNotes(res.data.notes);
      else setNotes([]);
    } catch (err) {
      console.error('Failed to load notes', err);
      // Handle unauthorized access or other errors
      if (err.response && err.response.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        alert('Failed to load notes. Please try again.');
      }
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notes on mount and when filters change
  useEffect(() => {
    fetchNotes();
  }, [semester, subject, user]); // Added user as dependency

  // Function to handle PDF file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadMessage(''); // Clear previous messages
    setUploadedPdfUrl(''); // Clear previous uploaded URL when a new file is selected
  };

  // Function to handle PDF upload (Admin only)
  const handleUploadPdf = async () => {
    if (!user || !isAdmin) {
      alert('Only admins can upload PDFs.');
      return;
    }
    if (!selectedFile) {
      alert('Please select a PDF file first.');
      return;
    }

    setIsUploadingPdf(true);
    setUploadMessage('');
    const formData = new FormData();
    formData.append('pdf', selectedFile); // 'pdf' must match the field name in multerConfig

    try {
      const response = await axios.post('http://localhost:3000/api/notes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setUploadedPdfUrl(response.data.data.url);
      setUploadMessage('PDF uploaded successfully!');
      setSelectedFile(null); // Clear the selected file input
      // Optionally clear the file input element itself if needed
      document.getElementById('pdf-upload-input').value = '';
    } catch (err) {
      console.error('Failed to upload PDF', err);
      if (err.response && err.response.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setUploadMessage(`Error uploading PDF: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Function to handle note creation
  const handleCreateNote = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!newNoteTitle) {
      alert('Note title is required.');
      return;
    }
    if (!user) {
      alert('Please log in to create notes.');
      navigate('/login');
      return;
    }

    setIsCreatingNote(true);
    try {
      const noteData = {
        title: newNoteTitle,
        description: newNoteDescription,
        subject: newNoteSubject || subject, // Use subject from filter if not specified
        semester: newNoteSemester || semester, // Use semester from filter if not specified
        branch: newNoteBranch,
        // Only include pdfUrl if it exists, otherwise send undefined
        pdfUrl: uploadedPdfUrl ? uploadedPdfUrl : undefined,
      };

      const response = await axios.post('http://localhost:3000/api/notes', noteData, { withCredentials: true });

      alert('Note created successfully!');
      // Clear the form
      setNewNoteTitle('');
      setNewNoteDescription('');
      setNewNoteSubject('');
      setNewNoteSemester('');
      setNewNoteBranch('');
      setUploadedPdfUrl(''); // Clear uploaded PDF URL after creating note
      setSelectedFile(null); // Clear file input state
      document.getElementById('pdf-upload-input').value = ''; // Clear file input element
      setShowCreateNotePopup(false); // Hide popup after successful creation
      fetchNotes(); // Refresh the list of notes
    } catch (err) {
      console.error('Failed to create note', err);
      if (err.response && err.response.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        alert(`Error creating note: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setIsCreatingNote(false);
    }
  };

  const openNote = async (note) => {
    // If the PDF is hosted remotely with CORS issues, use server proxy endpoint
    // We'll call backend /api/notes/file?url=... or ?filePath=...
    try {
      let fileUrl = note.pdfUrl;
      // If the url looks like an ImageKit path (no protocol), use proxy with filePath
      if (fileUrl && !fileUrl.startsWith('http')) {
        // pass as filePath
  const proxyRes = await axios.get(`http://localhost:3000/api/notes/file?filePath=${encodeURIComponent(fileUrl)}`, { responseType: 'blob', withCredentials: true });
        const blob = new Blob([proxyRes.data], { type: proxyRes.headers['content-type'] || 'application/pdf' });
        const objectUrl = URL.createObjectURL(blob);
        setSelected({ ...note, _viewerUrl: objectUrl, _proxied: true });
      } else {
        // try to fetch proxied blob first to avoid CORS when possible
        try {
          const proxyRes = await axios.get(`http://localhost:3000/api/notes/file?url=${encodeURIComponent(fileUrl)}`, { responseType: 'blob', withCredentials: true });
          const blob = new Blob([proxyRes.data], { type: proxyRes.headers['content-type'] || 'application/pdf' });
          const objectUrl = URL.createObjectURL(blob);
          setSelected({ ...note, _viewerUrl: objectUrl, _proxied: true });
        } catch (err) {
          // fallback to direct URL
          setSelected({ ...note, _viewerUrl: fileUrl, _proxied: false });
        }
      }
      setViewerOpen(true);
    } catch (err) {
      console.error('openNote error', err);
      setSelected(null);
    }
  };

  const closeViewer = () => {
    try {
      if (selected && selected._proxied && selected._viewerUrl) URL.revokeObjectURL(selected._viewerUrl);
    } catch (e) {}
    setSelected(null);
    setViewerOpen(false);
  };

  return (
    <div className='p-2'>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="#" onClick={handleGoBack} className="text-gray-400">
            <ChevronLeft size={24} />
          </Link>
          <h1 className='ml-4 text-2xl font-semibold'>Notes</h1>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreateNotePopup(true)}
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Note
          </button>
        )}
      </div>
      {/* Subjects List */}
      <div className="mb-6">
        <SubjectsList
          items={[{ name: 'All' }, { name: 'Data Structures' }, { name: 'Algorithms' }, { name: 'Operating Systems' }, { name: 'Database Management' }]}
          onItemSelect={(item) => setSubject(item.name === 'All' ? '' : item.name)}
          className="w-full"
          itemClassName="bg-gray-200 text-gray-800"
        />
      </div>
      {/* Create Note Popup */}
      {showCreateNotePopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
        >
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowCreateNotePopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-white">Create New Note</h2>

            <div className="mb-6 p-4 rounded bg-gray-700 border border-gray-600">
              {/* PDF Upload Section (Admin Only) */}
              <h3 className="text-xl font-semibold mb-3 text-white">Upload New PDF (Admin)</h3>
              <div className="flex flex-col md:flex-row gap-2 items-center mb-3">
                <input
                  id="pdf-upload-input"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="px-3 py-2 rounded bg-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
                
              </div>
              {uploadMessage && <p className={`text-sm ${uploadMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{uploadMessage}</p>}
              {uploadedPdfUrl && (
                <div className="mt-3 p-2 rounded bg-gray-600 text-white text-sm">
                  <p>PDF Uploaded: <a href={uploadedPdfUrl} target="_blank" rel="noreferrer" className="underline">{uploadedPdfUrl}</a></p>
                </div>
              )}

              {/* Note Creation Form */}
              <h3 className="text-xl font-semibold mb-3 text-white">{uploadedPdfUrl ? 'Create Note with PDF' : 'Create New Note'}</h3>
              <form onSubmit={handleCreateNote} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Title *"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="px-3 py-2 rounded bg-gray-600 text-white"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newNoteDescription}
                  onChange={(e) => setNewNoteDescription(e.target.value)}
                  className="px-3 py-2 rounded bg-gray-600 text-white h-24 resize-none"
                ></textarea>
                <input
                  type="text"
                  placeholder="Subject (e.g. Data Structures)"
                  value={newNoteSubject || subject} // Pre-fill from filter if available
                  onChange={(e) => setNewNoteSubject(e.target.value)}
                  className="px-3 py-2 rounded bg-gray-600 text-white"
                />
                <input
                  type="text"
                  placeholder="Semester (e.g. 3)"
                  value={newNoteSemester || semester} // Pre-fill from filter if available
                  onChange={(e) => setNewNoteSemester(e.target.value)}
                  className="px-3 py-2 rounded bg-gray-600 text-white"
                />
                {isAdmin && ( // Only show branch for admins for now
                  <input
                    type="text"
                    placeholder="Branch (e.g. CSE)"
                    value={newNoteBranch}
                    onChange={(e) => setNewNoteBranch(e.target.value)}
                    className="px-3 py-2 rounded bg-gray-600 text-white"
                  />
                )}
                {uploadedPdfUrl && (
                  <div className="p-2 rounded bg-gray-600 text-white text-sm">
                    <p>Attached PDF: <a href={uploadedPdfUrl} target="_blank" rel="noreferrer" className="underline">{uploadedPdfUrl}</a></p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isCreatingNote || !newNoteTitle}
                  className="px-4 py-2 bg-teal-500 text-white rounded disabled:opacity-50"
                >
                  {isCreatingNote ? 'Saving...' : 'Save Note'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
