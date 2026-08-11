import { createElement } from 'react';
import { ArrowRight, BookOpenText, Books, Brain, CalendarBlank, Exam, FileText } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const studyLinks = [
  { to: '/notespage', title: 'Course notes', copy: 'Read material organised by subject.', icon: BookOpenText },
  { to: '/pyqspage', title: 'Past papers', copy: 'Prepare with previous exam papers.', icon: Exam },
  { to: '/syllabus', title: 'Syllabus', copy: 'Keep your official course scope close.', icon: FileText },
  { to: '/ai', title: 'Study AI', copy: 'Break a difficult topic into a first step.', icon: Brain },
];

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const firstName = user?.name?.trim().split(/\s+/)[0] || 'Student';
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const date = new Intl.DateTimeFormat('en', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
  const ready = Boolean(user?.branch && user?.semester);
  const destination = ready ? '/subjects' : user ? '/profiledata' : '/login';
  return <div className="home-page">
    <section className="study-overview" data-reveal>
      <div className="study-overview__main"><p className="context-label">{greeting}, {firstName}</p><h1>A clear place to begin your study.</h1><p>Open the right subject, keep your syllabus nearby, and move through today’s work without hunting across different places.</p><div className="study-overview__actions"><Link to={destination} className="btn-primary">{ready ? 'Continue to subjects' : user ? 'Set up your course' : 'Create your workspace'} <ArrowRight size={18} /></Link><Link to="/archive" className="btn-secondary">Browse library</Link></div></div>
      <aside className="study-today" aria-label="Current academic context"><div className="study-today__date"><CalendarBlank size={22} /><span>{date}</span></div><div className="study-today__course"><span>Your course</span><strong>{user?.branch || 'Course not set'}</strong><p>{user?.semester ? `Semester ${user.semester}${user?.year ? ` · Year ${user.year}` : ''}` : 'Complete your profile for a personal subject list.'}</p></div><Link to={ready ? '/subjects' : destination}>Open academic workspace <ArrowRight size={17} /></Link></aside>
    </section>
    <div className="section-heading" data-reveal><div><p className="context-label">Study tools</p><h2>What would you like to work on?</h2></div><Link to="/archive">View full library <ArrowRight size={17} /></Link></div>
    <section className="study-link-grid" aria-label="Study shortcuts"><Link to={destination} className="study-link study-link--featured" data-reveal><span className="study-link__icon"><Books size={25} weight="duotone" /></span><div><span className="study-link__meta">Personal workspace</span><h3>My subjects</h3><p>{ready ? `${user.branch} · Semester ${user.semester}` : 'Set your course once and keep relevant material together.'}</p></div><ArrowRight className="study-link__arrow" size={20} /></Link>{studyLinks.map((item) => <Link to={item.to} key={item.to} className="study-link" data-reveal><span className="study-link__icon">{createElement(item.icon, { size: 23, weight: 'duotone' })}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div><ArrowRight className="study-link__arrow" size={19} /></Link>)}</section>
    <section className="reading-note" data-reveal><div><span>Study principle</span><h2>Small, focused sessions beat a crowded plan.</h2></div><p>Choose one subject, open one resource, and give it your full attention. UNIO keeps the next useful action visible.</p></section>
  </div>;
};

export default Home;
