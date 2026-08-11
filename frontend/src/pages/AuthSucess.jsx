import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CircleNotch, ShieldCheck } from '@phosphor-icons/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loadUser } from '../store/authSlice';
import BrandMark from '../components/ui/BrandMark';

const AuthSucess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const handleAuth = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, { signal: controller.signal });
        if (!response.data?.user) throw new Error('Authenticated user was not returned');
        dispatch(loadUser({ user: response.data.user, token: null }));
        toast.success('Logged in successfully');
        navigate('/', { replace: true });
      } catch (error) {
        if (error.code === 'ERR_CANCELED') return;
        toast.error('Authentication failed');
        navigate('/login?error=Authentication%20failed', { replace: true });
      }
    };

    void handleAuth();
    return () => controller.abort();
  }, [dispatch, navigate]);

  return (
    <main className="auth-shell">
      <section className="auth-story" aria-labelledby="auth-story-title">
        <BrandMark />
        <div className="auth-story__copy">
          <h1 id="auth-story-title">Your workspace is almost ready.</h1>
          <p>
            We are securely connecting your Google account and preparing your
            personalised UNIO study space.
          </p>
        </div>
        <div className="relative z-[1] flex items-center gap-3 text-[var(--color-text-muted)]">
          <ShieldCheck size={24} weight="duotone" className="text-[var(--color-primary)]" aria-hidden="true" />
          <span>Secure account verification</span>
        </div>
      </section>

      <section className="auth-panel" aria-labelledby="auth-status-title">
        <div className="auth-form text-center" role="status" aria-live="polite" aria-atomic="true">
          <div className="state-panel">
            <span className="state-panel__icon" aria-hidden="true">
              <CircleNotch size={28} weight="bold" className="is-spinning" />
            </span>
            <h2 id="auth-status-title">Signing you in</h2>
            <p>Please wait while we finish authenticating your account.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthSucess;
