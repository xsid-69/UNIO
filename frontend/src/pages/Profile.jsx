import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileImage from '../components/ProfileImage';
import isAdmin from './../../../backend/middlewares/admin.middleware';



const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className='flex w-full h-screen items-start'>
      <div id='Profile' className="bg-gray-900 flex items-center flex-col  p-6 rounded-lg shadow-lg max-w-xs w-full text-center">
        {user?.isAdmin ? 
        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          Admin
        </div> 
        : null  
      }
        <Link to={"/profilesettings"} >
           <div className="relative w-full h-16 my-2">
          <ProfileImage 
            src={user?.profilePic || user?.avatar}
            size="md"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-white"
          />
        </div>
        <h2 id='name' className="text-base font-bold mb-0.5">{user?.name || 'User Name'}</h2>
        <p id='info' className="text-gray-400 text-xs flex items-center justify-center gap-1 mb-1">
          {user?.email || 'user@example.com'}
        </p>
        <p>{user?.branch}</p>
        <div>
          <span>{user?.year} year </span>
          <span>{user?.semester} Semester</span>
        </div>
        </Link>
        
      </div>
    </div>
  );
};

export default Profile;
