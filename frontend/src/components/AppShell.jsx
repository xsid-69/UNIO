import { cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { UploadSimple, X } from '@phosphor-icons/react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import BottomNavbar from './BottomNavbar';
import BrandMark from './ui/BrandMark';
import ProfileImage from './ProfileImage';
import { BRANCHES, SEMESTERS } from '../constants/academic';

const initialForm = {
  title: '', description: '', branch: '', semester: '', subject: '',
  inputMethod: 'file', file: null, pdfUrl: '',
};

export default function AppShell({ sidebar }) {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectError, setSubjectError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const closeModal = useCallback(() => {
    if (submitting) return;
    setModalOpen(false);
    setForm(initialForm);
    setSubjects([]);
    setSubjectError('');
    setError('');
  }, [submitting]);
  const openModal = () => {
    lastFocusedRef.current = document.activeElement;
    setModalOpen(true);
  };

  useEffect(() => {
    if (!modalOpen) lastFocusedRef.current?.focus();
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return undefined;
    titleRef.current?.focus();
    const onKeyDown = (event) => event.key === 'Escape' && closeModal();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [modalOpen, closeModal]);

  useEffect(() => {
    if (!form.branch || !form.semester) {
      setSubjects([]);
      setSubjectError('');
      return;
    }
    const controller = new AbortController();
    const fetchSubjects = async () => {
      setSubjectsLoading(true);
      setSubjectError('');
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/subjects/byUser`, {
          params: { branch: form.branch, semester: Number(form.semester) },
          signal: controller.signal,
        });
        setSubjects(Array.isArray(response.data) ? response.data : []);
      } catch (requestError) {
        if (requestError.code !== 'ERR_CANCELED') {
          setSubjectError('Subjects could not be loaded. Check the branch and semester.');
          setSubjects([]);
        }
      } finally {
        setSubjectsLoading(false);
      }
    };
    fetchSubjects();
    return () => controller.abort();
  }, [form.branch, form.semester]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sourceMissing = form.inputMethod === 'file' ? !form.file : !form.pdfUrl;
    if (!form.title.trim() || !form.branch || !form.semester || !form.subject || sourceMissing) {
      setError('Complete every required field before creating the note.');
      return;
    }
    if (form.inputMethod === 'url') {
      try { new URL(form.pdfUrl); } catch { setError('Enter a complete, valid PDF URL.'); return; }
    }
    setSubmitting(true);
    setError('');
    try {
      let finalPdfUrl = form.pdfUrl;
      if (form.inputMethod === 'file') {
        const body = new FormData();
        body.append('pdf', form.file);
        const upload = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/notes/upload`, body);
        finalPdfUrl = upload.data.data.url;
      }
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/notes`, {
        title: form.title.trim(),
        description: form.description.trim(),
        subject: form.subject,
        branch: form.branch,
        semester: form.semester,
        pdfUrl: finalPdfUrl,
      });
      toast.success('Note published');
      setModalOpen(false);
      setForm(initialForm);
      setSubjects([]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'The note could not be created. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="noise-layer" aria-hidden="true" />
      <aside className="app-sidebar" aria-label="Primary navigation">
        {isValidElement(sidebar) ? cloneElement(sidebar, { onCreateNote: openModal }) : sidebar}
      </aside>
      <header className="mobile-topbar">
        <BrandMark />
        <button type="button" className="icon-button" onClick={() => navigate(user ? '/profiledata' : '/login')} aria-label={user ? 'Open profile' : 'Sign in'}>
          {user ? <ProfileImage src={user.profilePic || user.avatar} size="sm" /> : <span aria-hidden="true">IN</span>}
        </button>
      </header>
      <main id="main-content" className="app-main" tabIndex="-1">
        <div className="app-main__inner"><Outlet /></div>
      </main>
      <BottomNavbar />

      {modalOpen && (
        <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
          <section className="modal-panel app-scrollbar" role="dialog" aria-modal="true" aria-labelledby="upload-title">
            <div className="modal-panel__header">
              <div>
                <p className="context-label">Admin workspace</p>
                <h2 id="upload-title">Publish a study note</h2>
                <p>Add a PDF to the correct branch, semester, and subject.</p>
              </div>
              <button type="button" className="icon-button" onClick={closeModal} aria-label="Close upload dialog"><X size={20} /></button>
            </div>
            {error && <div className="alert alert--error" role="alert">{error}</div>}
            <form onSubmit={handleSubmit} className="form-grid upload-form">
              <div className="span-2">
                <label className="field-label" htmlFor="note-title">Title</label>
                <input ref={titleRef} id="note-title" className="field-control" value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="Advanced calculus — unit 3" required />
              </div>
              <div className="span-2">
                <label className="field-label" htmlFor="note-description">Description <span className="field-optional">(optional)</span></label>
                <textarea id="note-description" className="field-control" rows="3" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="What this note covers" />
              </div>
              <div>
                <label className="field-label" htmlFor="note-branch">Branch</label>
                <select id="note-branch" className="field-control" value={form.branch} onChange={(event) => setForm((current) => ({ ...current, branch: event.target.value, subject: '' }))} required>
                  <option value="">Choose branch</option>
                  {BRANCHES.map((branch) => <option key={branch}>{branch}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="note-semester">Semester</label>
                <select id="note-semester" className="field-control" value={form.semester} onChange={(event) => setForm((current) => ({ ...current, semester: event.target.value, subject: '' }))} required>
                  <option value="">Choose semester</option>
                  {SEMESTERS.map((semester) => <option key={semester} value={semester}>Semester {semester}</option>)}
                </select>
              </div>
              <div className="span-2">
                <label className="field-label" htmlFor="note-subject">Subject</label>
                <select id="note-subject" className="field-control" value={form.subject} onChange={(event) => update('subject', event.target.value)} disabled={!form.branch || !form.semester || subjectsLoading} required>
                  <option value="">{subjectsLoading ? 'Loading subjects…' : 'Choose subject'}</option>
                  {subjects.map((subject) => <option key={subject._id} value={subject._id}>{subject.name}</option>)}
                </select>
                {subjectError && <p className="field-error" role="alert">{subjectError}</p>}
              </div>
              <fieldset className="source-fieldset">
                <legend className="field-label">PDF source</legend>
                <div className="segmented-control">
                  {['file', 'url'].map((method) => (
                    <label key={method}>
                      <input className="sr-only" type="radio" name="source" value={method} checked={form.inputMethod === method} onChange={() => setForm((current) => ({ ...current, inputMethod: method, file: null, pdfUrl: '' }))} />
                      {method === 'file' ? 'Upload file' : 'Use a URL'}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="span-2">
                {form.inputMethod === 'file' ? (
                  <><label className="field-label" htmlFor="note-file">PDF file</label><input id="note-file" className="field-control" type="file" accept="application/pdf,.pdf" onChange={(event) => update('file', event.target.files?.[0] || null)} required /></>
                ) : (
                  <><label className="field-label" htmlFor="note-url">PDF URL</label><input id="note-url" className="field-control" type="url" value={form.pdfUrl} onChange={(event) => update('pdfUrl', event.target.value)} placeholder="https://example.com/notes.pdf" required /></>
                )}
              </div>
              <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={closeModal} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting || subjectsLoading}>
                  <UploadSimple size={18} /> {submitting ? 'Publishing…' : 'Publish note'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
