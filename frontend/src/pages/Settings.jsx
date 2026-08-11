import { ArrowRight, Info, SignOut, Sliders, UserCircle } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { logoutUser } from '../store/authSlice';
import ProfileImage from '../components/ProfileImage';
import PageHeader from '../components/ui/PageHeader';

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const handleLogout = async () => {
    try { await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`); toast.success('Logged out'); }
    catch { toast.info('You were logged out on this device.'); }
    dispatch(logoutUser()); navigate('/login');
  };
  return <div><PageHeader back eyebrow="Workspace preferences" title="Settings" description="Your account, study profile, and interface information in one place." /><div className="settings-layout">
    <section className="surface-panel settings-profile" data-reveal><ProfileImage src={user?.profilePic || user?.avatar} size="xl" /><h2>{user?.name || 'Student workspace'}</h2><p>{user?.email || 'Sign in to personalise UNIO.'}</p>{user ? <Link to="/profiledata" className="btn-secondary settings-profile__action">Edit profile</Link> : <Link to="/login" className="btn-primary settings-profile__action">Sign in</Link>}</section>
    <div className="settings-sections"><section className="surface-panel settings-group" data-reveal aria-labelledby="account-settings-title"><h2 id="account-settings-title" className="settings-group__title">ACCOUNT</h2>{user ? <Link className="settings-row" to="/profile"><span className="settings-row__lead"><span className="settings-row__icon"><UserCircle size={21} /></span><span><strong>Profile and course</strong><small>Review identity, branch, year, and semester</small></span></span><ArrowRight size={18} /></Link> : <Link className="settings-row" to="/login"><span className="settings-row__lead"><span className="settings-row__icon"><UserCircle size={21} /></span><span><strong>Sign in</strong><small>Access your personal academic workspace</small></span></span><ArrowRight size={18} /></Link>}</section>
    <section className="surface-panel settings-group settings-info-group" data-reveal aria-labelledby="experience-settings-title"><h2 id="experience-settings-title" className="settings-group__title">STUDY EXPERIENCE</h2><div className="settings-row settings-row--info"><span className="settings-row__lead"><span className="settings-row__icon"><Sliders size={21} /></span><span><strong>Focused reading interface</strong><small>Designed for long sessions with restrained motion and clear contrast.</small></span></span></div><div className="settings-row settings-row--info"><span className="settings-row__lead"><span className="settings-row__icon"><Info size={21} /></span><span><strong>Accessibility</strong><small>Keyboard focus, reduced motion, and readable touch targets are supported.</small></span></span></div></section>
    {user && <section className="surface-panel settings-group" data-reveal><button type="button" className="settings-row settings-row--danger" onClick={handleLogout}><span className="settings-row__lead"><span className="settings-row__icon"><SignOut size={21} /></span><span><strong>Log out</strong><small>End your current UNIO session</small></span></span><ArrowRight size={18} /></button></section>}</div>
  </div></div>;
};

export default Settings;
