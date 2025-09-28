import React from 'react';
import { useSelector } from 'react-redux';
import UserSubjectsDisplay from '../components/UserSubjectsDisplay'; // Import the new component

const SubjectsPage = () => {
  // Get user info from Redux store
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="container mx-auto p-4">
      {/* Page title */}
      <h1 className="text-2xl font-bold mb-4 text-white">Your Subjects</h1>

      {/* Render the UserSubjectsDisplay component, passing the user object */}
      <UserSubjectsDisplay user={user} />
    </div>
  );
};

export default SubjectsPage;
