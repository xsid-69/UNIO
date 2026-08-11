import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, BookOpenText } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StatePanel from './ui/StatePanel';

const SubjectSkeletons = () => <div className="subject-list" role="status" aria-label="Loading subjects">{Array.from({ length: 6 }, (_, index) => <div key={index} className="subject-skeleton" />)}</div>;

const UserSubjectsDisplay = ({ user }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const branch = user?.branch?.trim() || '';
  const semester = user?.semester?.toString() || '';
  const fetchSubjects = useCallback(async (signal) => {
    if (!branch || !semester) { setLoading(false); setSubjects([]); return; }
    setLoading(true); setError('');
    try { const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/subjects/byUser`, { params: { branch, semester }, signal }); setSubjects(Array.isArray(response.data) ? response.data : []); }
    catch (requestError) { if (requestError.code !== 'ERR_CANCELED') setError('We could not load your subjects. Check your connection and try again.'); }
    finally { setLoading(false); }
  }, [branch, semester]);
  useEffect(() => { const controller = new AbortController(); fetchSubjects(controller.signal); return () => controller.abort(); }, [fetchSubjects]);
  if (!user) return <StatePanel title="Sign in to see your subjects" description="Your branch and semester keep this list relevant to you." action={<Link to="/login" className="btn-primary">Sign in</Link>} />;
  if (!branch || !semester) return <StatePanel title="Complete your academic profile" description="Add your branch and semester once to unlock your subject list." action={<Link to="/profiledata" className="btn-primary">Set up profile</Link>} />;
  if (loading) return <SubjectSkeletons />;
  if (error) return <StatePanel type="error" title="Subjects are unavailable" description={error} action={<button type="button" className="btn-secondary" onClick={() => fetchSubjects()}>Try again</button>} />;
  if (!subjects.length) return <StatePanel title="No subjects found" description={`There are no subjects listed for ${branch}, semester ${semester}.`} />;
  return <section className="subject-list" aria-label="Available subjects">{subjects.map((subject, index) => <button key={subject._id} type="button" className="subject-item" onClick={() => navigate(`/subjects/${subject._id}`, { state: { subjectName: subject.name } })} data-reveal><span className="subject-item__index">{String(index + 1).padStart(2, '0')}</span><span className="subject-item__icon"><BookOpenText size={21} weight="duotone" /></span><span className="subject-item__copy"><strong>{subject.name}</strong><small>Open notes and reading material</small></span><ArrowRight className="subject-item__arrow" size={18} aria-hidden="true" /></button>)}</section>;
};

export default UserSubjectsDisplay;
