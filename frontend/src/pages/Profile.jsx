import React from 'react';

const Profile = () => {
  return (
    <div className='flex w-full h-screen items-start'>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-xs w-full text-center">
        <div className="relative w-full h-16 my-2">
          <img
            src="https://i.pinimg.com/736x/ee/63/79/ee63793a7276d8682064080a725953c4.jpg" // Placeholder image
            alt="Profile"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-white object-cover"
          />
        </div>
        <h2 className="text-base font-bold mb-0.5">Siddhant Wankhade</h2>
        <p className="text-gray-400 text-xs flex items-center justify-center gap-1 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Nagpur, India
        </p>
        
      </div>
    </div>
  );
};

export default Profile;
