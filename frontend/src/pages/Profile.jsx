import { ArrowRight, Books, Gear } from '@phosphor-icons/react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileImage from '../components/ProfileImage';
import PageHeader from '../components/ui/PageHeader';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  return <div><PageHeader back eyebrow="Student account" title="Your profile" description="The academic details shaping your subject list and study library." /><div className="profile-form-layout"><section className="surface-panel profile-summary" data-reveal><ProfileImage src={user?.profilePic || user?.avatar} size="xl" /><h2>{user?.name || 'Student'}</h2><p>{user?.email}</p>{user?.isAdmin && <span className="profile-role">Administrator</span>}</section><section className="surface-panel profile-fields" data-reveal><p className="context-label">Academic context</p><h2 className="profile-fields__title">Your current study setup</h2><div className="profile-facts"><div><span>Branch</span><strong>{user?.branch || 'Not set'}</strong></div><div><span>Year</span><strong>{user?.year ? `Year ${user.year}` : 'Not set'}</strong></div><div><span>Semester</span><strong>{user?.semester ? `Semester ${user.semester}` : 'Not set'}</strong></div></div><div className="profile-actions"><Link to="/profiledata" className="btn-primary">Edit profile <ArrowRight size={18} /></Link><Link to="/subjects" className="btn-secondary"><Books size={18} /> View subjects</Link><Link to="/settings" className="btn-ghost"><Gear size={18} /> Settings</Link></div></section></div></div>;
};

export default Profile;
