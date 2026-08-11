import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Eye, EyeSlash, GoogleLogo } from '@phosphor-icons/react';
import { loginUser } from '../store/authSlice';
import Spinner from '../components/Spinner';
import BrandMark from '../components/ui/BrandMark';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const loginHandler = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate('/');
    } catch {
      return;
    }
  };

  const openGoogleAuth = () => {
    window.open(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, '_self');
  };

  return (
    <main className="auth-shell">
      <section className="auth-story" aria-labelledby="login-story-title">
        <BrandMark />
        <div className="auth-story__copy">
          <h1 id="login-story-title">Welcome back to your study flow.</h1>
          <p>
            Pick up where you left off with your subjects, saved resources, and
            focused tools in one calm workspace.
          </p>
        </div>
        <ul className="relative z-[1] grid gap-3 text-[var(--color-text-muted)]" aria-label="UNIO benefits">
          {['Your learning dashboard, ready', 'Resources organised by subject', 'One account across every study tool'].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <CheckCircle size={20} weight="fill" className="shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="auth-panel" aria-labelledby="login-form-title">
        <div className="auth-form">
          <h2 id="login-form-title">Sign in</h2>
          <p className="auth-form__intro">Enter your details to continue to UNIO.</p>

          <form onSubmit={handleSubmit(loginHandler)} noValidate aria-busy={loading}>
            <div className="auth-form__fields">
              <div>
                <label className="field-label" htmlFor="email">Email address</label>
                <input
                  {...register('email', {
                    required: 'Enter your email address.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address.',
                    },
                  })}
                  className="field-control"
                  type="email"
                  id="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && <p className="field-error" id="email-error">{errors.email.message}</p>}
              </div>

              <div>
                <label className="field-label" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    {...register('password', { required: 'Enter your password.' })}
                    className="field-control pr-14"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="icon-button absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeSlash size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                  </button>
                </div>
                {errors.password && <p className="field-error" id="password-error">{errors.password.message}</p>}
              </div>

              {error && <div className="alert alert--error" role="alert">{error}</div>}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <><Spinner size={0.9} thickness={2} speed={700} /><span>Signing in…</span></>
                ) : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="auth-form__divider" aria-hidden="true">or continue with</div>
          <button type="button" className="btn-secondary w-full" onClick={openGoogleAuth}>
            <GoogleLogo size={20} weight="bold" aria-hidden="true" />
            Continue with Google
          </button>

          <p className="mt-7 text-center text-sm text-[var(--color-text-muted)]">
            New to UNIO?{' '}
            <Link className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
