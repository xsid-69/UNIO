import { Student } from '@phosphor-icons/react';
import { useSelector } from 'react-redux';
import PageHeader from './ui/PageHeader';
import UserSubjectsDisplay from './UserSubjectsDisplay';

const ResourceCategoryPage = ({ title, description }) => {
  const { user } = useSelector((state) => state.auth);
  return <div className="subject-page"><PageHeader title={title} description={description} eyebrow="Subject workspace" back /><div className="subject-context" data-reveal><Student size={20} weight="duotone" /><div><span>{user?.branch || 'Course not set'}</span><strong>{user?.semester ? `Semester ${user.semester}` : 'Add your semester'}</strong></div><p>Select a subject to open its available PDFs directly in the reader.</p></div><UserSubjectsDisplay user={user} /></div>;
};

export default ResourceCategoryPage;
