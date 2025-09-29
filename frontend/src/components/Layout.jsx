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
    setIsLoading(false);
    setError('');
    setFetchedSubjects([]); // Clear subjects

    setUploadPopupOpen(!isUploadPopupOpen);
  };

  // Handler for form submission
  const handleCreateNoteSubmit = async (event) => {
    event.preventDefault();

    if (!title || !selectedSubjectId || !selectedFile || !selectedBranch || !selectedSemester) {
      setError('Please fill in all required fields: Title, Subject, Branch, Semester, and upload a PDF.');
      return;
    }

    setIsLoading(true);
    setError('');
    setPdfUrl(''); // Clear previous PDF URL

    try {
      // 1. Upload PDF to ImageKit
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const uploadResponse = await axios.post('/api/notes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization header is handled by the backend middleware (isAuthenticated, isAdmin)
        },
      });

      const uploadedPdfUrl = uploadResponse.data.data.url;
      setPdfUrl(uploadedPdfUrl); // Update state to show uploaded URL

      // 2. Create the note with the PDF URL
      const noteData = {
        title,
        description,
        subject: selectedSubjectId, // Use the selected subject ID
        branch: selectedBranch,
        semester: selectedSemester,
        pdfUrl: uploadedPdfUrl,
      };

      const noteResponse = await axios.post('/api/notes', noteData, {
        headers: {
          // Authorization header is handled by the backend middleware (isAuthenticated, isAdmin)
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
      setFetchedSubjects([]); // Clear subjects
      toggleUploadPopup(); // Close the popup after successful creation

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
          const response = await axios.get(`http://localhost:3000/api/subjects/byUser`, {
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
    <div className="w-full h-screen">
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-[#222748]"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <span className="block w-6 h-0.5 bg-white mb-1"></span>
        <span className="block w-6 h-0.5 bg-white mb-1"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[96px_1fr_0] lg:grid-cols-[96px_1fr_340px] grid-rows-1 h-full">
        {/* Sidebar */}
        {/* Mobile: hidden unless open, Desktop: always visible */}
        <aside
          className={`bg-[#222748]/10 backdrop-blur-md flex flex-col items-center py-8 gap-8 rounded-l-3xl
            fixed top-0 left-0 h-full z-40 transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:static md:translate-x-0 md:flex md:w-[96px] w-64
          `}
        >
          {/* Close button for mobile */}
          <button
            className="md:hidden absolute top-4 right-4 p-2 rounded bg-transparent"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <span className="block w-5 h-0.5 bg-white rotate-45 absolute"></span>
            <span className="block w-5 h-0.5 bg-white -rotate-45"></span>
          </button>
          {sidebar}
        </aside>
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-transparent z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
        )}
        {/* Main Section */}
        <main className="md:p-10 p-10  md:w-[70vw]">
          <Outlet />
        </main>
        {/* Profile Aside for desktop */}
        <aside
          id="Profile"
          className="hidden md:flex flex-col items-center bg-[#222748]/10 backdrop-blur-md w-[22vw] p-8 text-white overflow-y-auto"
        >
          {isLoggedIn ? (
            <>
              <Profile />
              {user?.isAdmin && (
                <div className="mt-3 p-4 bg-gray-900 rounded-lg shadow-md text-white w-full text-center">
                  <p className="text-lg font-semibold">Admin Note Creation</p>
                  <button onClick={toggleUploadPopup} className="mt-2 bg-[#13c4a3] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#10a080] transition-colors">
                    Create New Note
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <button
                onClick={handleSignInClick}
                className="bg-[#13c4a3] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#10a080] transition-colors"
              >
                Sign in now
              </button>
            </div>
          )}
        </aside>
        {/* Profile Circle for mobile */}
        <>
          <button
            className="md:hidden fixed top-4 right-4 z-50 w-11 h-11 bg-[#232946] rounded-full flex items-center justify-center shadow-lg border-2 border-[#13c4a3] text-white text-lg font-bold"
            onClick={() => setProfileOpen(true)}
            aria-label="Open profile panel"
          >
            {isLoggedIn ? (
              <img
                src={user?.profilePic || user?.avatar } // Use user?.profilePic as requested
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              'Sign In'
            )}
          </button>
          {/* Slide-in Profile panel for mobile */}
          {profileOpen && (
            <div className="md:hidden fixed top-0 right-0 h-full w-64 bg-[#222748]/10 backdrop-blur-md rounded-l-3xl p-8 z-50 flex flex-col items-center gap-6 transition-transform duration-300 shadow-2xl overflow-y-auto">
              <button
                className="absolute top-4 left-4 p-2 rounded bg-[#181f2a]"
                onClick={() => setProfileOpen(false)}
                aria-label="Close profile panel"
              >
                <span className="block w-5 h-0.5 bg-white rotate-45 absolute"></span>
                <span className="block w-5 h-0.5 bg-white -rotate-45"></span>
              </button>
              {/* Profile Content for mobile */}
              {isLoggedIn ? (
                <>
                  <Profile />
                  {user?.isAdmin && (
                    <div className="mt-3 p-4 bg-gray-700 rounded-lg shadow-md text-white w-full text-center">
                      <p className="text-lg font-semibold">Admin Note Creation</p>
                      <button onClick={toggleUploadPopup} className="mt-2 bg-[#13c4a3] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#10a080] transition-colors">
                        Create New Note
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <button
                    onClick={handleSignInClick}
                    className="bg-[#13c4a3] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#10a080] transition-colors"
                  >
                    Sign in now
                  </button>
                </div>
              )}
            </div>
          )}
          {/* Overlay for mobile profile panel */}
          {profileOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setProfileOpen(false)}
              aria-label="Close profile overlay"
            />
          )}
        </>
      </div>

      {/* Notes Uploading Popup */}
      {isUploadPopupOpen && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-11/12 md:w-1/2 lg:w-1/3 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
              onClick={toggleUploadPopup}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Upload New Note</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {pdfUrl && <p className="text-green-400 mb-4">PDF uploaded: {pdfUrl}</p>}
            <form onSubmit={handleCreateNoteSubmit} className="space-y-4">
              <div>
                <label htmlFor="noteTitle" className="block text-sm font-medium text-gray-300">Note Title</label>
                <input
                  type="text"
                  id="noteTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-[#13c4a3] focus:border-[#13c4a3]"
                  placeholder="Enter note title"
                  required
                />
              </div>
              <div>
                <label htmlFor="noteDescription" className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  id="noteDescription"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-[#13c4a3] focus:border-[#13c4a3]"
                  placeholder="Enter a brief description"
                ></textarea>
              </div>
              <div>
                <label htmlFor="noteBranch" className="block text-sm font-medium text-gray-300">Branch</label>
                <select
                  id="noteBranch"
                  className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-[#13c4a3] focus:border-[#13c4a3]"
                  value={selectedBranch}
                  onChange={(e) => {
                    setSelectedBranch(e.target.value);
                    setSelectedSubjectId(''); // Clear subject selection when branch changes
                    setFetchedSubjects([]); // Clear subjects
                  }}
                  required
                >
                  <option value="">Select Branch</option>
                  {['Computer Science and Engineering', 'Artificial Intelligence & Machine Learning', 'Artificial Intelligence', 'Computer Science Engineering Data Science', 'Computer Science and Engineering (Cyber Security)', 'Chemical Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Electronics Engineering', 'Electronics and TeleCommunication Engineering', 'Information Technology', 'Civil Engineering', 'Industrial Engineering', 'Biomedical Engineering', 'Fire Engineering', 'Electronics Design Technology'].map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="noteSemester" className="block text-sm font-medium text-gray-300">Semester</label>
                <select
                  id="noteSemester"
                  className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-[#13c4a3] focus:border-[#13c4a3]"
                  value={selectedSemester}
                  onChange={(e) => {
                    setSelectedSemester(e.target.value);
                    setSelectedSubjectId(''); // Clear subject selection when semester changes
                    setFetchedSubjects([]); // Clear subjects
                  }}
                  required
                >
                  <option value="">Select Semester</option>
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="noteSubject" className="block text-sm font-medium text-gray-300">Subject</label>
                <select
                  id="noteSubject"
                  className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-[#13c4a3] focus:border-[#13c4a3]"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  disabled={!selectedBranch || !selectedSemester || subjectsLoading}
                  required
                >
                  <option value="">
                    {subjectsLoading
                      ? 'Loading Subjects...'
                      : !selectedBranch || !selectedSemester
                      ? 'Select Branch and Semester'
                      : 'Select Subject'}
                  </option>
                  {fetchedSubjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                {subjectFetchError && (
                  <p className="text-red-500 text-sm mt-1">{subjectFetchError}</p>
                )}
              </div>
              <div>
                <label htmlFor="noteFile" className="block text-sm font-medium text-gray-300">Upload File</label>
                <input
                  type="file"
                  id="noteFile"
                  accept=".pdf"
                  onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                    setPdfUrl(''); // Clear previous URL if a new file is selected
                    setError(''); // Clear error on new file selection
                  }}
                  className="mt-1 block w-full text-sm text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#13c4a3] file:text-white
                    hover:file:bg-[#10a080] cursor-pointer"
                  required
                />
                {selectedFile && <p className="text-sm text-gray-400 mt-2">Selected: {selectedFile.name}</p>}
              </div>
              <button
                type="submit"
                disabled={!title || !selectedSubjectId || !selectedFile || !selectedBranch || !selectedSemester || isLoading}
                className="w-full bg-[#13c4a3] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#10a080] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Uploading & Creating...' : 'Upload Note'}
              </button>
            </form>
          </div>
        </div>
      )}

      <BottomNavbar />
    </div>
  );
}
