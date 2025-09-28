import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import UserSubjectsDisplay from '../../../components/UserSubjectsDisplay'; // Import the reusable component
import { useSelector } from 'react-redux'; // Import useSelector

const SolvedQPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Get user from Redux

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='p-2 h-[90vh] overflow-y-auto scrollbar-hide '>
      <div className="flex items-center justify-start mb-6">
        <Link to="#" onClick={handleGoBack} className="text-gray-400">
          <ChevronLeft size={24} />
        </Link>
        <h1 className='ml-4 text-2xl font-semibold'>Solved Questions</h1>
      </div>

      {/* Display Subjects */}
      <div className="mb-6">
        <UserSubjectsDisplay user={user} />
      </div>

      {/* Placeholder for Solved Questions content */}
      <div className="text-white">
        <p>Solved Questions content will be displayed here.</p>
      </div>
    </div>
  );
}

export default SolvedQPage
