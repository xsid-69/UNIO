import { createElement } from 'react';
import { ArrowRight, BookOpenText, Exam, FileText, SealQuestion } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageHeader from '../components/ui/PageHeader';
import StatePanel from '../components/ui/StatePanel';

const resources = [
  { to: '/notespage', title: 'Course notes', copy: 'Lecture notes and revision material organised by your subjects.', kind: 'Read & revise', icon: BookOpenText },
  { to: '/pyqspage', title: 'Previous papers', copy: 'Practice with university question papers from earlier semesters.', kind: 'Exam practice', icon: Exam },
  { to: '/solvedqpage', title: 'Solved questions', copy: 'Follow worked solutions and understand the steps behind an answer.', kind: 'Learn by example', icon: SealQuestion },
  { to: '/syllabus', title: 'Branch syllabus', copy: 'Keep the official course scope open while you plan and revise.', kind: 'Plan your study', icon: FileText },
];

const Resources = () => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <StatePanel title="Your study library is ready" description="Sign in so UNIO can match resources to your branch and semester." action={<Link to="/login" className="btn-primary">Sign in <ArrowRight size={18} /></Link>} />;
  return <div className="library-page">
    <PageHeader title="Study library" eyebrow="Your academic material" description="Everything is organised by course, semester, and subject so you can begin reading quickly." back />
    <div className="course-context" data-reveal><div><span>Current course</span><strong>{user.branch || 'Add your branch'}</strong></div><div><span>Semester</span><strong>{user.semester || 'Not set'}</strong></div><Link to="/profiledata" className="btn-ghost">Update profile <ArrowRight size={17} /></Link></div>
    <section className="library-grid" aria-label="Resource types">{resources.map((resource) => <Link to={resource.to} key={resource.to} className="library-card" data-reveal><div className="library-card__top"><span className="library-card__icon">{createElement(resource.icon, { size: 25, weight: 'duotone' })}</span><ArrowRight size={19} /></div><div><span className="library-card__kind">{resource.kind}</span><h2>{resource.title}</h2><p>{resource.copy}</p></div></Link>)}</section>
  </div>;
};

export default Resources;
