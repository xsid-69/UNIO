import { createElement } from 'react';
import { Books, Gear, House, Sparkle } from '@phosphor-icons/react';
import { Link, useLocation } from 'react-router-dom';

const items = [
  { to: '/', label: 'Today', icon: House, matches: ['/'] },
  { to: '/archive', label: 'Library', icon: Books, matches: ['/archive', '/notespage', '/pyqspage', '/solvedqpage', '/syllabus', '/subjects'] },
  { to: '/ai', label: 'Study AI', icon: Sparkle, matches: ['/ai'] },
  { to: '/settings', label: 'Settings', icon: Gear, matches: ['/settings', '/profile', '/profiledata', '/profilesettings'] },
];

const BottomNavbar = () => {
  const { pathname } = useLocation();
  const active = (item) => item.matches.some((path) => path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`));
  return <nav className="bottom-nav" aria-label="Mobile navigation">{items.map((item) => <Link key={item.to} to={item.to} className={`nav-item ${active(item) ? 'is-active' : ''}`} aria-current={active(item) ? 'page' : undefined}>{createElement(item.icon, { size: 21, weight: active(item) ? 'fill' : 'regular', 'aria-hidden': true })}<span>{item.label}</span></Link>)}</nav>;
};

export default BottomNavbar;
