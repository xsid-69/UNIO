import { useState } from 'react';
import { CheckCircle, FloppyDisk } from '@phosphor-icons/react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUserProfile } from '../../store/authSlice';
import { BRANCHES, SEMESTERS, YEARS } from '../../constants/academic';
import ProfileImage from '../../components/ProfileImage';
import PageHeader from '../../components/ui/PageHeader';
import StatePanel from '../../components/ui/StatePanel';

const ProfileData = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState(() => ({ name: user?.name || '', email: user?.email || '', branch: user?.branch || '', year: user?.year || '', semester: user?.semester || '' }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  if (!user) return <StatePanel title="Sign in to edit your profile" description="Your academic details are connected to your UNIO account." action={<Link to="/login" className="btn-primary">Sign in</Link>} />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required.'); return; }
    setSubmitting(true); setError('');
    try {
      await dispatch(updateUserProfile({ ...form, name: form.name.trim(), email: form.email.trim() })).unwrap();
      toast.success('Profile updated');
    } catch (requestError) {
      setError(typeof requestError === 'string' ? requestError : 'Your profile could not be updated.');
    } finally { setSubmitting(false); }
  };

  return (
    <div>
      <PageHeader back eyebrow="Personalize UNIO" title="Edit profile" description="These details decide which subjects and study resources UNIO shows you." />
      <form className="profile-form-layout" onSubmit={handleSubmit} noValidate>
        <aside className="surface-panel profile-summary" data-reveal><ProfileImage src={user.profilePic || user.avatar} size="xl" /><h2>{form.name || 'Student'}</h2><p>Your current profile image comes from your account provider.</p><div className="profile-completion"><CheckCircle size={18} weight="fill" /><span>Profile fields supported by UNIO</span></div></aside>
        <section className="surface-panel profile-fields" data-reveal>
          {error && <div className="alert alert--error profile-form-error" role="alert">{error}</div>}
          <div className="form-grid">
            <div><label className="field-label" htmlFor="profile-name">Full name</label><input id="profile-name" className="field-control" value={form.name} onChange={(event) => update('name', event.target.value)} autoComplete="name" required /></div>
            <div><label className="field-label" htmlFor="profile-email">Email address</label><input id="profile-email" className="field-control" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" required /></div>
            <div className="span-2"><label className="field-label" htmlFor="profile-branch">Branch</label><select id="profile-branch" className="field-control" value={form.branch} onChange={(event) => update('branch', event.target.value)}><option value="">Choose your branch</option>{BRANCHES.map((branch) => <option key={branch}>{branch}</option>)}</select></div>
            <div><label className="field-label" htmlFor="profile-year">Year</label><select id="profile-year" className="field-control" value={form.year} onChange={(event) => update('year', event.target.value)}><option value="">Choose year</option>{YEARS.map((year) => <option key={year} value={year}>Year {year}</option>)}</select></div>
            <div><label className="field-label" htmlFor="profile-semester">Semester</label><select id="profile-semester" className="field-control" value={form.semester} onChange={(event) => update('semester', event.target.value)}><option value="">Choose semester</option>{SEMESTERS.map((semester) => <option key={semester} value={semester}>Semester {semester}</option>)}</select></div>
            <div className="span-2 profile-save-row"><button type="submit" className="btn-primary" disabled={submitting}><FloppyDisk size={18} />{submitting ? 'Saving…' : 'Save profile'}</button></div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default ProfileData;
