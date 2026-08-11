import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Eye, EyeSlash, GoogleLogo } from '@phosphor-icons/react';
import { registerUser } from '../store/authSlice';
import Spinner from '../components/Spinner';
import BrandMark from '../components/ui/BrandMark';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const registerHandler = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      navigate('/login');
    } catch {
      return;
    }
  };

  const openGoogleAuth = () => {
    window.open(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, '_self');
  };

  return (
    <main className="auth-shell">
      <section className="auth-story" aria-labelledby="register-story-title">
        <BrandMark />
        <div className="auth-story__copy">
          <h1 id="register-story-title">Build a better study rhythm.</h1>
          <p>
            Create your UNIO account and turn scattered course material into a
            focused, personal learning workspace.
          </p>
        </div>
        <ul className="relative z-[1] grid gap-3 text-[var(--color-text-muted)]" aria-label="UNIO benefits">
          {['Keep every subject within reach', 'Find resources without the clutter', 'Move from planning to focused study'].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <CheckCircle size={20} weight="fill" className="shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="auth-panel" aria-labelledby="register-form-title">
        <div className="auth-form">
          <h2 id="register-form-title">Create your account</h2>
          <p className="auth-form__intro">Start your personalised UNIO workspace.</p>

          <form onSubmit={handleSubmit(registerHandler)} noValidate aria-busy={loading}>
            <div className="auth-form__fields">
              <div>
                <label className="field-label" htmlFor="name">Name</label>
                <input
                  {...register('name', {
                    required: 'Enter your name.',
                    minLength: { value: 2, message: 'Name must be at least 2 characters.' },
                  })}
                  className="field-control"
                  type="text"
                  id="name"
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && <p className="field-error" id="name-error">{errors.name.message}</p>}
              </div>

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
                    {...register('password', {
                      required: 'Create a password.',
                      minLength: { value: 8, message: 'Use at least 8 characters.' },
                    })}
                    className="field-control pr-14"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : 'password-hint'}
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
                {errors.password ? (
                  <p className="field-error" id="password-error">{errors.password.message}</p>
                ) : (
                  <p className="mt-2 text-xs text-[var(--color-text-faint)]" id="password-hint">Use 8 or more characters.</p>
                )}
              </div>

              {error && <div className="alert alert--error" role="alert">{error}</div>}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <><Spinner size={0.9} thickness={2} speed={700} /><span>Creating account…</span></>
                ) : 'Create account'}
              </button>
            </div>
          </form>

          <div className="auth-form__divider" aria-hidden="true">or sign up with</div>
          <button type="button" className="btn-secondary w-full" onClick={openGoogleAuth}>
            <GoogleLogo size={20} weight="bold" aria-hidden="true" />
            Continue with Google
          </button>

          <p className="mt-7 text-center text-sm text-[var(--color-text-muted)]">
            Already have an account?{' '}
            <Link className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
