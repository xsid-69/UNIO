import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, User, Bell, Moon, Lock, FileText, HelpCircle, LogOut } from 'lucide-react';
import ProfileImage from '../components/ProfileImage';
import axios from 'axios';
import { toast } from 'react-toastify';
import { logoutUser } from '../store/authSlice';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { logout: contextLogout } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };
    const handleLogout = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`);
        toast.success('Logged out');
      } catch (err) {
        console.warn('Server logout failed, continuing with client-side logout', err);
        toast.warn('Local logout');
      }
      dispatch(logoutUser());
      contextLogout();
      navigate('/login');
    };
    
  return (
    <div className="h-[90vh] overflow-y-auto scrollbar-hide rounded-3xl glass-card p-6 md:p-8 animate-[fadeIn_0.5s_ease-out] border border-[var(--glass-border)]">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--glass-border)]">
        <button onClick={handleGoBack} className="p-2 rounded-full hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold font-display">Settings</h1>
        <div className="w-10"></div>
      </div>

      {/* Profile Section */}
      <Link to={'/profiledata'} className="bg-[var(--color-surface)]/50 border border-[var(--glass-border)] rounded-2xl p-4 mb-8 flex items-center justify-between hover:bg-[var(--color-surface-hover)] transition-all group">
        <div className="flex items-center">
          <ProfileImage src={user?.profilePic || user?.avatar} size="sm" className="mr-4 ring-2 ring-[var(--color-primary)]/20 group-hover:ring-[var(--color-primary)]/50 transition-all" />
          <div>
            <p className="font-semibold text-lg">{user?.name || 'User Name'}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{user?.branch}</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-[var(--color-text-muted)] group-hover:text-white transition-colors" />
      </Link>

      {/* Other Settings Section */}
      <h3 className="text-[var(--color-text-muted)] text-sm font-semibold uppercase tracking-wider mb-4 ml-2">Preferences</h3>
      <div className="bg-[var(--color-surface)]/30 border border-[var(--glass-border)] rounded-2xl mb-8 overflow-hidden">
        <SettingItem icon={<User size={20} />} text="Account Settings" to="/profilesettings" />
        <SettingItem icon={<Bell size={20} />} text="Notifications" hasToggle={true} />
        <SettingItem icon={<Moon size={20} />} text="Dark Mode" hasToggle={true} />
      </div>

      {/* More Information Section */}
      <h3 className="text-[var(--color-text-muted)] text-sm font-semibold uppercase tracking-wider mb-4 ml-2">Support & Legal</h3>
      <div className="bg-[var(--color-surface)]/30 border border-[var(--glass-border)] rounded-2xl mb-8 overflow-hidden">
        <SettingItem icon={<Lock size={20} />} text="Privacy Policy" to="/privacy-policy" />
        <SettingItem icon={<FileText size={20} />} text="Terms and Conditions" to="/terms-conditions" />
        <SettingItem icon={<HelpCircle size={20} />} text="Help Center" to="/help-center" />
      </div>

      {/* Actions Section */}
      <div className="bg-[var(--color-surface)]/30 border border-[var(--glass-border)] rounded-2xl overflow-hidden">
        <SettingItem icon={<LogOut size={20} />} text="Logout" textColor="text-red-400" onClick={handleLogout}/>
      </div>
    </div>
  );
};

const SettingItem = ({ icon, text, hasToggle = false, textColor = "text-white", to, onClick }) => {
  const content = (
    <>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg bg-[var(--color-surface)] text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:bg-[var(--color-primary)]/10 transition-colors`}>{icon}</div>
        <p className={`${textColor} font-medium`}>{text}</p>
      </div>
      {hasToggle ? (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--color-primary)]"></div>
        </label>
      ) : (
        <ChevronRight size={18} className="text-[var(--color-text-muted)] group-hover:text-white transition-colors" />
      )}
    </>
  );

  const commonProps = {
    className: "flex items-center justify-between p-4 border-b border-[var(--glass-border)] last:border-b-0 cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors group",
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
