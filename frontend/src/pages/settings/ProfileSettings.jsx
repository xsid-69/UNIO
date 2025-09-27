import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../../store/authSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { ChevronLeft } from 'lucide-react';


const ProfileSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    const doLogout = async () => {
      try {
        await axios.post('http://localhost:3000/api/auth/logout');
        toast.success('Logged out');
      } catch (err) {
        console.warn('Server logout failed, continuing with client-side logout', err);
        toast.warn('Server logout failed, continuing with local logout');
      }
      dispatch(logoutUser());
      navigate('/login');
    };
    doLogout();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

   const { user } = useSelector((state) => state.auth);
  return (
    <div className="min-h-[93vh] md:w-[65vw] w-[82vw] rounded-2xl md:mr-0 mr-10  bg-gray-900 p-4 md:p-8 text-gray-200  flex flex-col items-center"> {/* Applied centering, width, min-height, and flexbox for centering */}
      <div className="max-w-2xl overflow-y-auto scrollbar-hide h-[80vh]"> {/* Added overflow-y-auto, scrollbar-hide, and h-[80vh] for PC scrollability */}
        <div className="flex items-center mb-8">
          <Link to="#" onClick={handleGoBack} className="text-gray-400 mr-4">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold text-white">My Profile</h1>
        </div>

        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-600 mb-4">
            <img
              src= {user?.profilePic || user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random&color=fff&size=128`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 items-center">
            
            
            <button id='logout' onClick={handleLogout} className='w-full md:w-auto px-5 py-2 border border-gray-600 text-gray-200 rounded-md hover:bg-red-500 transition-colors text-sm'>Logout</button>
          </div>
        </div>
       

      {/* Name Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 w-full">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
            readOnly
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
            readOnly
          />
        </div>
      </div>

      {/* Account Security Section */}
      <h2 className="text-2xl font-semibold mb-8 text-white w-full text-left">Account Security</h2>

      <div className="space-y-6 mb-10">
        {/* Email */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 w-full">
          <div className="w-full md:flex-grow md:mr-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
              readOnly
            />
          </div>
          <button className="w-full md:w-auto px-5 py-2 border border-gray-600 text-gray-200 rounded-md hover:bg-gray-800 transition-colors text-sm">
            Change email
          </button>
        </div>

        {/* Password */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 w-full">
          <div className="w-full md:flex-grow md:mr-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
              value="********"
              readOnly
            />
          </div>
          <button className="w-full md:w-auto px-5 py-2 border border-gray-600 text-gray-200 rounded-md hover:bg-gray-800 transition-colors text-sm">
            Change password
          </button>
        </div>
      </div>

      {/* Support Access Section */}
      <h2 className="text-2xl font-semibold mb-8 text-white w-full text-left">Support Access</h2>

      <div className="space-y-6 mb-10">
        {/* Support access */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 w-full">
          <div>
            <h3 className="text-base font-medium text-gray-100">
              Support access
            </h3>
            <p className="text-sm text-gray-400">
              You have granted us to access to your account for support purposes until Aug 31, 2023, 9:40 PM.
            </p>
          </div>
          {/* Toggle Switch */}
          <label htmlFor="supportAccess" className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="supportAccess" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Log out of all devices */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 w-full">
          <div>
            <h3 className="text-base font-medium text-gray-100">
              Log out of all devices
            </h3>
            <p className="text-sm text-gray-400">
              Log out of all other active sessions on other devices besides this one.
            </p>
          </div>
          <button className="w-full md:w-auto px-5 py-2 border border-gray-600 text-gray-200 rounded-md hover:bg-gray-800 transition-colors text-sm">
            Log out
          </button>
        </div>

        {/* Delete my account */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 w-full">
          <div>
            <h3 className="text-base font-medium text-red-500">
              Delete my account
            </h3>
            <p className="text-sm text-gray-400">
              Permanently delete the account and remove access from all workspaces.
            </p>
          </div>
          <button className="w-full md:w-auto px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
            Delete Account
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfileSettings;
