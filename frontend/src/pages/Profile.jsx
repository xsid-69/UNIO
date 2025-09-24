import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className='flex w-full h-screen items-start'>
      <div id='Profile' className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-xs w-full text-center">
        <div className="relative w-full h-16 my-2">
          <img
            src={user?.profilePic} // Placeholder image, use user's if available
            alt="Profile"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-white object-cover"
          />
        </div>
        <h2 id='name' className="text-base font-bold mb-0.5">{user?.name || 'User Name'}</h2>
        <p id='info' className="text-gray-400 text-xs flex items-center justify-center gap-1 mb-1">
          {user?.email || 'user@example.com'}
        </p>
        
      </div>
    </div>
  );
};

export default Profile;
