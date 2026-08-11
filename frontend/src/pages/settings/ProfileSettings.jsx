import { ArrowRight, Books, EnvelopeSimple, SignOut, Student } from '@phosphor-icons/react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { logoutUser } from '../../store/authSlice';
import ProfileImage from '../../components/ProfileImage';
import PageHeader from '../../components/ui/PageHeader';

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const logout = async () => { try { await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`); toast.success('Logged out'); } catch { toast.info('You were logged out on this device.'); } dispatch(logoutUser()); navigate('/login'); };
  return <div><PageHeader back eyebrow="Account" title="Profile overview" description="Review the details connected to your current study workspace." action={<Link to="/profiledata" className="btn-primary">Edit profile <ArrowRight size={18} /></Link>} /><div className="profile-form-layout"><section className="surface-panel profile-summary" data-reveal><ProfileImage src={user?.profilePic || user?.avatar} size="xl" /><h2>{user?.name}</h2><p>{user?.email}</p></section><section className="surface-panel profile-fields" data-reveal><h2 className="account-title">Account details</h2><div className="account-detail"><span className="settings-row__icon"><EnvelopeSimple size={21} /></span><div><span>Email</span><strong>{user?.email || 'Not available'}</strong></div></div><div className="account-detail"><span className="settings-row__icon"><Student size={21} /></span><div><span>Course</span><strong>{user?.branch || 'Not set'}</strong></div></div><div className="account-detail"><span className="settings-row__icon"><Books size={21} /></span><div><span>Current stage</span><strong>{user?.year ? `Year ${user.year}` : 'Year not set'} · {user?.semester ? `Semester ${user.semester}` : 'Semester not set'}</strong></div></div><div className="account-note">Password changes and account deletion are not supported by the current account service.</div><button type="button" className="btn-secondary account-logout" onClick={logout}><SignOut size={18} /> Log out</button></section></div></div>;
};

export default ProfileSettings;
