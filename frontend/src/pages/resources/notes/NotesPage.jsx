import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import UserSubjectsDisplay from '../../../components/UserSubjectsDisplay'; // Import the reusable component
import { useSelector } from 'react-redux';

const NotesPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  // normalize admin check: prefer boolean isAdmin, fall back to role string for compatibility
  const isAdmin = user && typeof user.isAdmin === 'boolean' ? user.isAdmin : (user && user.role === 'admin');

  const handleGoBack = () => navigate(-1);

  return (
    <div className='p-2 h-[90vh] overflow-y-auto scrollbar-hide '>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="#" onClick={handleGoBack} className="text-gray-400">
            <ChevronLeft size={24} />
          </Link>
          <h1 className='ml-4 text-2xl font-semibold'>Notes</h1>
        </div>
        {/* Keep admin button if it's for creating notes, otherwise remove */}
        {/* For now, let's assume it's not needed for just displaying subjects */}
        {/* {isAdmin && (
          <button
            onClick={() => setShowCreateNotePopup(true)}
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Note
          </button>
        )} */}
      </div>

      {/* Display Subjects */}
      <div className="mb-6 ">
        <UserSubjectsDisplay user={user} />
      </div>

      {/* Placeholder for Notes content if needed, or remove if only subjects are displayed */}
      {/* If NotesPage should ONLY display subjects, this section can be removed */}
      <div className="text-white">
        {/* This section would typically contain the actual notes content */}
        {/* For now, we'll leave it as a placeholder or remove it if the goal is solely to show subjects */}
        <p>Notes content will be displayed here.</p>
      </div>
    </div>
  );
};

export default NotesPage;
