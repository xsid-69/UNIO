import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/AppRoutes';
import MotionProvider from './components/MotionProvider';
import { loadUser } from './store/authSlice';

axios.defaults.withCredentials = true;

const AppBoot = () => (
  <div className="min-h-dvh p-4 md:p-8" role="status" aria-label="Preparing UNIO">
    <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl gap-4 md:grid-cols-[220px_1fr]">
      <div className="hidden animate-pulse rounded-[24px] bg-[var(--color-surface)] md:block" />
      <div className="space-y-4 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-10">
        <div className="h-12 w-1/2 animate-pulse rounded-xl bg-[var(--color-surface-hover)]" />
        <div className="h-72 animate-pulse rounded-[24px] bg-[var(--color-surface-hover)]" />
        <div className="grid gap-4 sm:grid-cols-2"><div className="h-40 animate-pulse rounded-[20px] bg-[var(--color-surface-hover)]" /><div className="h-40 animate-pulse rounded-[20px] bg-[var(--color-surface-hover)]" /></div>
      </div>
    </div>
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const initialize = async () => {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common.Authorization;
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, { signal: controller.signal });
        if (response.data?.user) dispatch(loadUser({ user: response.data.user, token: null }));
      } catch (requestError) {
        if (requestError.code !== 'ERR_CANCELED') localStorage.removeItem('user');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void initialize();
    return () => controller.abort();
  }, [dispatch]);

  if (loading) return <AppBoot />;
  return (
    <MotionProvider>
      <AppRoutes />
      <ToastContainer position="bottom-right" theme="dark" autoClose={3500} closeOnClick pauseOnFocusLoss={false} />
    </MotionProvider>
  );
};

export default App;
