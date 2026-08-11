import { createElement } from 'react';
import { Books, Gear, House, SignIn, Sparkle, UploadSimple, UserCircle } from '@phosphor-icons/react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BrandMark from './ui/BrandMark';
import ProfileImage from './ProfileImage';

const items = [
  { to: '/', label: 'Today', icon: House, matches: ['/'] },
  { to: '/archive', label: 'Study library', icon: Books, matches: ['/archive', '/notespage', '/pyqspage', '/solvedqpage', '/syllabus', '/subjects'] },
  { to: '/ai', label: 'Study AI', icon: Sparkle, matches: ['/ai'] },
];

const Sidebar = ({ onCreateNote }) => {
  const { user } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const active = (item) => item.matches.some((path) => path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`));
  const navLink = (item) => <Link to={item.to} key={item.to} className={`nav-item ${active(item) ? 'is-active' : ''}`} aria-current={active(item) ? 'page' : undefined}>{createElement(item.icon, { size: 20, weight: active(item) ? 'fill' : 'regular', 'aria-hidden': true })}<span>{item.label}</span></Link>;
  const accountItem = user ? { to: '/profile', label: 'My profile', icon: UserCircle, matches: ['/profile', '/profiledata', '/profilesettings'] } : { to: '/login', label: 'Sign in', icon: SignIn, matches: ['/login', '/register'] };
  const settingsItem = { to: '/settings', label: 'Settings', icon: Gear, matches: ['/settings'] };
  return <>
    <div className="app-sidebar__brand"><BrandMark /></div>
    <div className="nav-section-label">Workspace</div>
    <nav className="app-sidebar__nav">{items.map(navLink)}<div className="nav-divider" />{navLink(accountItem)}{navLink(settingsItem)}{user?.isAdmin && <button type="button" className="nav-item nav-item--button" onClick={onCreateNote}><UploadSimple size={20} /><span>Publish material</span></button>}</nav>
    <div className="app-sidebar__footer">{user ? <Link to="/profile" className="mini-profile"><ProfileImage src={user.profilePic || user.avatar} size="sm" /><span className="mini-profile__copy"><strong>{user.name}</strong><span>{user.branch ? `${user.branch} · Sem ${user.semester || '—'}` : 'Complete academic profile'}</span></span></Link> : <Link to="/login" className="btn-primary sidebar-signin">Start studying</Link>}</div>
  </>;
};

export default Sidebar;
