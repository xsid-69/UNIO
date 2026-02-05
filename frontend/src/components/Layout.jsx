import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BottomNavbar from './BottomNavbar';
import Profile from '../pages/Profile';
import { useSelector } from 'react-redux'; 
import axios from 'axios';

export default function Layout({ sidebar, rightPanel }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isUploadPopupOpen, setUploadPopupOpen] = useState(false); // New state for upload popup
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [fetchedSubjects, setFetchedSubjects] = useState([]); // State for fetched subjects
  const [subjectsLoading, setSubjectsLoading] = useState(false); // State for loading indicator
  const [subjectFetchError, setSubjectFetchError] = useState(null); // State for subject fetch error
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(''); // State for selected subject ID
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [inputMethod, setInputMethod] = useState('file'); // 'file' or 'url'
  const [manualPdfUrl, setManualPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login');
  };

  const toggleUploadPopup = () => {
    // Reset form state before toggling the popup visibility
    // This ensures the state is reset regardless of whether the popup was opening or closing
    setSelectedBranch('');
    setSelectedSemester('');
    setSelectedSubjectId('');
    setSelectedFile(null);
    setPdfUrl('');
    setInputMethod('file');
    setManualPdfUrl('');
    setIsLoading(false);
    setError('');
    setFetchedSubjects([]); // Clear subjects

    setUploadPopupOpen(!isUploadPopupOpen);
  };

  // Handler for form submission
  const handleCreateNoteSubmit = async (event) => {
    event.preventDefault();

    // Validation based on input method
    if (inputMethod === 'file') {
      if (!title || !selectedSubjectId || !selectedFile || !selectedBranch || !selectedSemester) {
        setError('Please fill in all required fields: Title, Subject, Branch, Semester, and upload a PDF.');
        return;
      }
    } else if (inputMethod === 'url') {
      if (!title || !selectedSubjectId || !manualPdfUrl || !selectedBranch || !selectedSemester) {
        setError('Please fill in all required fields: Title, Subject, Branch, Semester, and enter a PDF URL.');
        return;
      }
      // Basic URL validation
      if (!manualPdfUrl.startsWith('http') || !manualPdfUrl.includes('.pdf')) {
        setError('Please enter a valid PDF URL (must start with http/https and end with .pdf)');
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      let finalPdfUrl = manualPdfUrl;

      // Upload file if file method is selected
      if (inputMethod === 'file' && selectedFile) {
        const formData = new FormData();
        formData.append('pdf', selectedFile);

        const uploadResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/notes/upload`, formData, {
          headers: {
            'Content-Type': 'multipart-form-data',
          },
        });

        finalPdfUrl = uploadResponse.data.data.url;
      }

      // Create the note with the PDF URL
      const noteData = {
        title,
        description,
        subject: selectedSubjectId,
        branch: selectedBranch,
        semester: selectedSemester,
        pdfUrl: finalPdfUrl,
      };

      const noteResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/notes`, noteData, {
        headers: {
          // Authorization header is handled by the backend middleware
        },
      });

      alert('Note created successfully!');
      // Reset form fields
      setTitle('');
      setDescription('');
      setSelectedBranch('');
      setSelectedSemester('');
      setSelectedSubjectId('');
      setSelectedFile(null);
      setPdfUrl('');
      setInputMethod('file');
      setManualPdfUrl('');
      setFetchedSubjects([]);
      toggleUploadPopup();

    } catch (err) {
      console.error('Error creating note:', err);
      let errorMessage = 'Failed to create note.';
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.request) {
        errorMessage = 'Network error. Please try again.';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSubjectsForUpload = async () => {
      if (selectedBranch && selectedSemester) {
        setSubjectsLoading(true);
        setSubjectFetchError(null);
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/subjects/byUser`, {
            params: {
              branch: selectedBranch,
              semester: Number(selectedSemester) // Ensure semester is a Number
            }
          });
          setFetchedSubjects(response.data);
        } catch (e) {
          console.error("Error fetching subjects for upload:", e);
          setSubjectFetchError("Failed to load subjects for selected branch and semester.");
          setFetchedSubjects([]);
        } finally {
          setSubjectsLoading(false);
        }
      } else {
        setFetchedSubjects([]);
        setSubjectFetchError(null);
      }
    };

    fetchSubjectsForUpload();
  }, [selectedBranch, selectedSemester]);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)] opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600 opacity-[0.03] blur-[120px]" />
      </div>

      {/* Hamburger removed as requested */}

      <div className="grid grid-cols-1 md:grid-cols-[96px_1fr_0] lg:grid-cols-[96px_1fr_340px] grid-rows-1 h-full relative z-10">
        {/* Sidebar */}
        <aside
          className={`glass-card flex flex-col items-center py-8 gap-8 border-r border-[var(--glass-border)]
            fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:static md:translate-x-0 md:flex md:w-[96px] w-72 md:bg-transparent md:border-0 md:backdrop-filter-none md:shadow-none
          `}
        >
          {/* Close button for mobile */}
          <button
            className="md:hidden absolute top-4 right-4 p-2 text-[var(--color-text-muted)] hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <span className="block w-5 h-0.5 bg-current rotate-45 absolute transition-transform"></span>
            <span className="block w-5 h-0.5 bg-current -rotate-45 transition-transform"></span>
          </button>
          {sidebar}
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
        )}

        {/* Main Section */}
        <main className="md:p-10 p-6 w-full md:max-w-7xl mx-auto overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>

        {/* Profile Aside for desktop */}
        <aside
          id="Profile"
          className="hidden lg:flex flex-col items-center bg-[var(--color-surface)]/30 backdrop-blur-md border-l border-[var(--glass-border)] w-full p-8 text-[var(--color-text-main)] overflow-y-auto"
        >
          {isLoggedIn ? (
            <>
              <Profile />
              {user?.isAdmin && (
                <div className="mt-6 p-6 glass-card rounded-2xl w-full text-center">
                  <p className="text-lg font-semibold mb-3">Admin Actions</p>
                  <button onClick={toggleUploadPopup} className="btn-primary w-full py-2.5 rounded-xl font-medium shadow-lg shadow-[var(--color-primary)]/20">
                    Create New Note
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center w-full">
              <button
                onClick={handleSignInClick}
                className="btn-primary w-full py-3 rounded-xl font-semibold shadow-lg shadow-[var(--color-primary)]/20"
              >
                Sign in now
              </button>
            </div>
          )}
        </aside>

        {/* Profile Circle for mobile */}
        <>
          <button
            className="md:hidden fixed top-4 right-4 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-lg border-2 border-[var(--color-primary)] bg-[var(--color-surface)] overflow-hidden"
            onClick={() => setProfileOpen(true)}
            aria-label="Open profile panel"
          >
            {isLoggedIn ? (
              <img
                src={user?.profilePic || user?.avatar }
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-[var(--color-primary)]">Sign In</span>
            )}
          </button>

          {/* Slide-in Profile panel for mobile */}
          {profileOpen && (
            <div className="md:hidden fixed top-0 right-0 h-full w-80 glass-card border-l border-[var(--glass-border)] z-[60] flex flex-col items-center p-8 gap-6 transition-transform duration-300 shadow-2xl overflow-y-auto">
              <button
                className="absolute top-4 left-4 p-2 text-[var(--color-text-muted)] hover:text-white"
                onClick={() => setProfileOpen(false)}
                aria-label="Close profile panel"
              >
                <span className="block w-5 h-0.5 bg-current rotate-45 absolute"></span>
                <span className="block w-5 h-0.5 bg-current -rotate-45"></span>
              </button>
              
              {isLoggedIn ? (
                <>
                  <Profile />
                  {user?.isAdmin && (
                    <div className="mt-4 p-5 glass-card rounded-2xl w-full text-center">
                      <p className="text-lg font-semibold mb-3">Admin Actions</p>
                      <button onClick={toggleUploadPopup} className="btn-primary w-full py-2 rounded-lg font-semibold">
                        Create New Note
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center w-full mt-10">
                   <h3 className="text-xl font-bold mb-4">Welcome to UNIO</h3>
                   <p className="text-[var(--color-text-muted)] mb-6">Sign in to access your profile and notes.</p>
                  <button
                    onClick={handleSignInClick}
                    className="btn-primary w-full py-3 rounded-xl font-semibold"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          )}
          
          {profileOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
              onClick={() => setProfileOpen(false)}
            />
          )}
        </>
      </div>

      {/* Notes Uploading Popup */}
      {isUploadPopupOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="glass-card p-8 rounded-3xl w-full max-w-lg relative animate-[fadeIn_0.3s_ease-out]">
            <button
              className="absolute top-5 right-5 text-[var(--color-text-muted)] hover:text-white text-2xl transition-colors"
              onClick={toggleUploadPopup}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[var(--color-primary)] to-blue-400 bg-clip-text text-transparent">Upload New Note</h2>
            
            {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm">{error}</div>}
            {pdfUrl && <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-200 text-sm break-all">PDF Ready: {pdfUrl}</div>}
            
            <form onSubmit={handleCreateNoteSubmit} className="space-y-4">
              <div>
                <label htmlFor="noteTitle" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Title</label>
                <input
                  type="text"
                  id="noteTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="modern-input w-full p-2.5 rounded-lg text-sm"
                  placeholder="e.g. Advanced Calculus Notes"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="noteBranch" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Branch</label>
                  <select
                    id="noteBranch"
                    className="modern-input w-full p-2.5 rounded-lg text-sm appearance-none"
                    value={selectedBranch}
                    onChange={(e) => {
                      setSelectedBranch(e.target.value);
                      setSelectedSubjectId('');
                      setFetchedSubjects([]);
                    }}
                    required
                  >
                    <option value="" className="bg-[var(--color-surface)]">Select Branch</option>
                    {['Computer Science and Engineering', 'Artificial Intelligence & Machine Learning', 'Artificial Intelligence', 'Computer Science Engineering Data Science', 'Computer Science and Engineering (Cyber Security)', 'Chemical Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Electronics Engineering', 'Electronics and TeleCommunication Engineering', 'Information Technology', 'Civil Engineering', 'Industrial Engineering', 'Biomedical Engineering', 'Fire Engineering', 'Electronics Design Technology'].map((branch) => (
                      <option key={branch} value={branch} className="bg-[var(--color-surface)]">
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="noteSemester" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Semester</label>
                  <select
                    id="noteSemester"
                    className="modern-input w-full p-2.5 rounded-lg text-sm appearance-none"
                    value={selectedSemester}
                    onChange={(e) => {
                      setSelectedSemester(e.target.value);
                      setSelectedSubjectId('');
                      setFetchedSubjects([]);
                    }}
                    required
                  >
                    <option value="" className="bg-[var(--color-surface)]">Sem</option>
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((semester) => (
                      <option key={semester} value={semester} className="bg-[var(--color-surface)]">
                        {semester}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="noteSubject" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Subject</label>
                <select
                  id="noteSubject"
                  className="modern-input w-full p-2.5 rounded-lg text-sm appearance-none"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  disabled={!selectedBranch || !selectedSemester || subjectsLoading}
                  required
                >
                  <option value="" className="bg-[var(--color-surface)]">
                    {subjectsLoading
                      ? 'Loading subjects...'
                      : !selectedBranch || !selectedSemester
                      ? 'Select Branch & Sem first'
                      : 'Select Subject'}
                  </option>
                  {fetchedSubjects.map((subject) => (
                    <option key={subject._id} value={subject._id} className="bg-[var(--color-surface)]">
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Method Selection */}
              <div className="pt-2">
                <div className="flex bg-[var(--color-surface)]/50 p-1 rounded-lg border border-[var(--color-border)]">
                  <label className={`flex-1 flex items-center justify-center py-1.5 rounded-md cursor-pointer text-sm font-medium transition-all ${inputMethod === 'file' ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-white'}`}>
                    <input
                      type="radio"
                      name="inputMethod"
                      value="file"
                      checked={inputMethod === 'file'}
                      onChange={(e) => {
                        setInputMethod(e.target.value);
                        setSelectedFile(null);
                        setManualPdfUrl('');
                        setPdfUrl('');
                        setError('');
                      }}
                      className="hidden"
                    />
                    Upload File
                  </label>
                  <label className={`flex-1 flex items-center justify-center py-1.5 rounded-md cursor-pointer text-sm font-medium transition-all ${inputMethod === 'url' ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-white'}`}>
                    <input
                      type="radio"
                      name="inputMethod"
                      value="url"
                      checked={inputMethod === 'url'}
                      onChange={(e) => {
                        setInputMethod(e.target.value);
                        setSelectedFile(null);
                        setPdfUrl('');
                        setError('');
                      }}
                       className="hidden"
                    />
                    Enter URL
                  </label>
                </div>
              </div>

              <div>
                 {inputMethod === 'file' ? (
                  <div className="relative">
                     <input
                      type="file"
                      id="noteFile"
                      accept=".pdf"
                      onChange={(e) => {
                        setSelectedFile(e.target.files[0]);
                        setPdfUrl('');
                        setError('');
                      }}
                      className="w-full text-sm text-[var(--color-text-muted)]
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[var(--color-primary)] file:text-white
                        hover:file:bg-[var(--color-primary-hover)] cursor-pointer"
                      required
                    />
                  </div>
                ) : (
                  <input
                    type="url"
                    id="pdfUrl"
                    value={manualPdfUrl}
                    onChange={(e) => {
                      setManualPdfUrl(e.target.value);
                      setPdfUrl('');
                      setError('');
                    }}
                    className="modern-input w-full p-2.5 rounded-lg text-sm"
                    placeholder="https://example.com/document.pdf"
                    required
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 rounded-xl font-bold shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-[var(--color-primary)]/40 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? (inputMethod === 'file' ? 'Uploading...' : 'Processing...')
                  : 'Create Note'
                }
              </button>
            </form>
          </div>
        </div>
      )}

      <BottomNavbar />
    </div>
  );
}
