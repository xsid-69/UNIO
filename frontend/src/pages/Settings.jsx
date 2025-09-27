import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, User, Bell, Moon, Lock, FileText, HelpCircle, LogOut } from 'lucide-react';
import ProfileImage from '../components/ProfileImage';
import axios from 'axios';
import { toast } from 'react-toastify';
import { logoutUser } from '../store/authSlice';

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleGoBack = () => {
    navigate(-1);
  };
    const handleLogout = async () => {
      try {
        // Inform server to clear httpOnly cookie
        await axios.post('http://localhost:3000/api/auth/logout');
        toast.success('Logged out');
      } catch (err) {
        console.warn('Server logout failed, continuing with client-side logout', err);
        toast.warn('Server logout failed, continuing with local logout');
      }
      dispatch(logoutUser());
      navigate('/login');
    };
    
  return (
    // Added styles to hide scrollbar for different browsers using Tailwind arbitrary values
    <div className="h-[90vh] overflow-y-auto scrollbar-hide rounded-2xl bg-gray-900 text-white p-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center justify-between mb-6">
        <Link to="#" onClick={handleGoBack} className="text-gray-400">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-semibold">Settings</h1>
        <div className="w-6"></div> {/* Placeholder for alignment */}
      </div>

      {/* Profile Section */}
      <Link to={'/profiledata'} className="bg-gray-800 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <ProfileImage src={user?.profilePic || user?.avatar} size="sm" className="mr-3" />
          <div>
            <p className="font-medium">{user?.name || 'User Name'}</p>
            <p className="text-sm text-gray-400">{user?.branch}</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </Link>

      {/* Other Settings Section */}
      <p className="text-gray-400 text-sm mb-3">Other settings</p>
      <div className="bg-gray-800 rounded-xl mb-6">
        <SettingItem icon={<User size={20} />} text="Account Settings " to="/profilesettings" />
        <SettingItem icon={<Bell size={20} />} text="Notifications" hasToggle={true} />
        <SettingItem icon={<Moon size={20} />} text="Dark Mode" hasToggle={true} />
      </div>

      {/* More Information Section */}
      <p className="text-gray-400 text-sm mb-3">More information</p>
      <div className="bg-gray-800 rounded-xl mb-6">
        <SettingItem icon={<Lock size={20} />} text="Privacy Policy" to="/privacy-policy" />
        <SettingItem icon={<FileText size={20} />} text="Terms and Conditions" to="/terms-conditions" />
        <SettingItem icon={<HelpCircle size={20} />} text="Help Center" to="/help-center" />
      </div>

      {/* Actions Section */}
      <div className="bg-gray-800 rounded-xl">
        <SettingItem icon={<LogOut size={20} />} text="Logout" textColor="text-red-500" onClick={handleLogout}/>
      </div>
    </div>
  );
};

const SettingItem = ({ icon, text, hasToggle = false, textColor = "text-white", to, onClick }) => {
  const content = (
    <>
      <div className="flex items-center">
        <div className="mr-3">{icon}</div>
        <p className={`${textColor}`}>{text}</p>
      </div>
      {hasToggle ? (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      ) : (
        <ChevronRight size={20} className="text-gray-400" />
      )}
    </>
  );

  const commonProps = {
    className: "flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0 cursor-pointer",
    onClick: onClick,
  };

  if (to) {
    return (
      <Link to={to} {...commonProps}>
        {content}
      </Link>
    );
  }

  return (
    <div {...commonProps}>
      {content}
    </div>
  );
};

export default Settings;
