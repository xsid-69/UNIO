import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import { GrNotes } from "react-icons/gr";
import { AiOutlineFileDone } from "react-icons/ai";
import { FaBookOpen } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { Filter, Search, ChevronLeft, AlertTriangle } from 'lucide-react'; // Added Filter, Search
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Resources = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); // Get isLoggedIn from AuthContext
  const [showLoginPopup, setShowLoginPopup] = useState(!isLoggedIn); // State for the login popup
  const [activeTab, setActiveTab] = useState('Features'); // Add state for active tab

  useEffect(() => {
    // If not logged in, show the popup. The popup will handle navigation.
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    } else {
      setShowLoginPopup(false); // Hide popup if logged in
    }
  }, [isLoggedIn]); // Depend on isLoggedIn

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <> {/* Use a Fragment to wrap the popup and the main content */}
      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-center flex flex-col items-center"> {/* Added flex column and items-center */}
            <AlertTriangle className="text-yellow-500 w-16 h-16 mb-4" /> {/* Using yellow for warning */}
            <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
            <p className="text-white mb-6">You need to be logged in to access this resource.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Login
            </button>
          </div>
        </div>
      )}
      {/* Only render the main content if the popup is NOT shown */}
      {!showLoginPopup && (
        <div className='p-4 h-[90vh] overflow-y-auto scrollbar-hide text-white'>
          <div className="flex items-center justify-start mb-6">
            <Link to="#" onClick={handleGoBack} className="text-gray-400">
              <ChevronLeft size={24} />
            </Link>
            <h1 className='text-4xl ml-4 font-bold'>Resources</h1>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center mb-6 px-4 border-b border-gray-700 pb-2">
            <button
              onClick={() => setActiveTab('Features')}
              className={`px-4 py-2 font-semibold rounded-lg mr-2 transition-colors duration-300 ${activeTab === 'Features' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Features
            </button>
            <button
              onClick={() => setActiveTab('Learning')}
              className={`px-4 py-2 font-semibold rounded-lg mr-2 transition-colors duration-300 ${activeTab === 'Learning' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Learning
            </button>
            <button
              onClick={() => setActiveTab('Certifications')}
              className={`px-4 py-2 font-semibold rounded-lg mr-2 transition-colors duration-300 ${activeTab === 'Certifications' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Certifications
            </button>
           
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-6 px-4">
            <div className="flex items-center text-gray-400">
              <Filter className="w-5 h-5 mr-2" />
              <span>Filter</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Search className="w-5 h-5 mr-2" />
              <span>Search</span>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'Features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1 */}
              <Link to={'/pyqspage'} className='rounded-2xl p-4 bg-gray-800 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 hover:shadow-lg'>
                <img src="https://i.pinimg.com/1200x/f9/9c/56/f99c56de61b3723d1fc6457fc87d9bc9.jpg" alt="Resource" className="w-full h-80 object-cover rounded-lg mb-4" />
                <div>
                  <h2 className='text-xl font-bold mb-2'>Previos year University Question Papers</h2>
                  <div className='flex justify-between text-gray-400 text-sm'>
                    <span>N/A</span>
                    <span>Admin</span>
                  </div>
                </div>
              </Link>
              {/* Card 2 */}
              <Link to={'/notespage'} className='rounded-2xl p-4 bg-gray-800 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 hover:shadow-lg'>
                <img src="https://i.pinimg.com/1200x/f3/2a/67/f32a67d0d7b0d2ab15e4a6e492a3b601.jpg" alt="Resource" className="w-full h-80 object-cover rounded-lg mb-4" />
                <div>
                  <h2 className='text-xl font-bold mb-2'>Topper Notes</h2>
                  <div className='flex justify-between text-gray-400 text-sm'>
                    <span>N/A</span>
                    <span>Admin</span>
                  </div>
                </div>
              </Link>
              {/* Card 3 */}
              <Link to={'/solvedqpage'} className='rounded-2xl p-4 bg-gray-800 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 hover:shadow-lg'>
                <img src="https://i.pinimg.com/1200x/5f/97/63/5f9763324073105d84ec0600d2406b8b.jpg" alt="Resource" className="w-full h-80 object-cover rounded-lg mb-4" />
                <div>
                  <h2 className='text-xl font-bold mb-2'>Get University Questions Solved</h2>
                  <div className='flex justify-between text-gray-400 text-sm'>
                    <span>N/A</span>
                    <span>Admin</span>
                  </div>
                </div>
              </Link>
              {/* Card 4 */}
              <Link to={'/syllabus'} className='rounded-2xl p-4 bg-gray-800 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 hover:shadow-lg'>
                <img src="https://i.pinimg.com/1200x/49/8e/31/498e31550f0fb128e0b688d499b4431a.jpg" alt="Resource" className="w-full h-80 object-cover rounded-lg mb-4" />
                <div>
                  <h2 className='text-xl font-bold mb-2'>Complete Syllabus of your Branch</h2>
                  <div className='flex justify-between text-gray-400 text-sm'>
                    <span>N/A</span>
                    <span>Admin</span>
                  </div>
                </div>
              </Link>
            </div>
          )}
          {activeTab === 'Learning' && (
            <div className="text-center py-10">
              <p className="text-gray-400">No learning resources available yet.</p>
            </div>
          )}
          {activeTab === 'Certifications' && (
            <div className="text-center py-10">
              <p className="text-gray-400">No certifications available yet.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Resources;
