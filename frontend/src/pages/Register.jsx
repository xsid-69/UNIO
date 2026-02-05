import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import Spinner from '../components/Spinner';
import { GridBeams } from '../components/magicui/grid-beams';

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  const registerHandler = (data) => {
    dispatch(registerUser(data));
    navigate('/login');
  };

  useEffect(() => {
    if (user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center w-full relative overflow-hidden bg-[var(--color-background)]">
      <GridBeams className="absolute inset-0 z-0 opacity-40" />

       {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--color-primary)] opacity-[0.05] blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600 opacity-[0.05] blur-[120px]" />


      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl mx-auto p-4 lg:p-8 gap-10">
        
        {/* Left Section: Welcome */}
        <div className="flex-1 text-center lg:text-left animate-[fadeIn_0.5s_ease-out]">
          <div className="text-4xl font-bold mb-4">
             <span className="bg-gradient-to-r from-[var(--color-primary)] to-blue-400 bg-clip-text text-transparent">UNIO</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-[var(--color-text-main)] tracking-tight">
            Join the Future
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
            Create your account to unlock exclusive resources, collaborate with peers, and accelerate your learning journey.
          </p>
        </div>

        {/* Right Section: Sign Up Form */}
        <div className="w-full max-w-md glass-card p-8 md:p-10 rounded-3xl shadow-2xl relative animate-[slideInLeft_0.5s_ease-out]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50 blur-[1px]"></div>

          <h2 className="text-3xl font-bold text-center mb-8 text-[var(--color-text-main)] font-display">Create Account</h2>
          
          <form onSubmit={handleSubmit(registerHandler)} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">Username</label>
              <input
                {...register('name', { required: true })}
                type="text"
                id="name"
                autoComplete="username"
                placeholder="Choose a username"
                className="modern-input w-full p-3.5 rounded-xl text-white placeholder-gray-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">Email Address</label>
              <input
                {...register('email', { required: true })}
                type="email"
                id="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="modern-input w-full p-3.5 rounded-xl text-white placeholder-gray-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">Password</label>
              <input
                {...register('password', { required: true })}
                type="password"
                id="password"
                autoComplete="new-password"
                placeholder="Create a password"
                className="modern-input w-full p-3.5 rounded-xl text-white placeholder-gray-500"
              />
            </div>
            
            {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">{error}</div>}
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl font-bold shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-[var(--color-primary)]/40 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Spinner size={0.9} thickness={2} speed={700} />
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--glass-bg)] text-[var(--color-text-muted)]">Or sign up with</span>
            </div>
          </div>

          <div id='googleAuth'>
            <button
              onClick={() => window.open(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, "_self")}
              type="button"
              className="w-full py-3.5 rounded-xl font-semibold text-white bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-all flex items-center justify-center gap-3 group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.0003 4.75C14.0213 4.75 15.8013 5.49062 17.1413 6.71937L20.0003 3.86062C17.9413 1.97062 15.1713 0.75 12.0003 0.75C7.72031 0.75 4.00031 3.14062 2.26031 6.71937L6.03031 9.67937C6.84031 7.06937 9.25031 4.75 12.0003 4.75Z" fill="#EA4335"/>
                <path d="M21.9997 12.25C21.9997 11.59 21.9397 10.98 21.8297 10.38H12.0003V14.38H17.4003C17.1897 15.57 16.4397 16.59 15.3497 17.29L19.1197 20.25C21.3097 18.27 22.6997 15.45 22.6997 12.25H21.9997V12.25Z" fill="#4285F4"/>
                <path d="M6.03031 9.67937L2.26031 6.71937C1.56031 8.41937 1.18031 10.28 1.18031 12.25C1.18031 14.22 1.56031 16.0806 2.26031 17.7806L6.03031 14.8206C5.79031 14.1606 5.66031 13.42 5.66031 12.25C5.66031 11.08 5.79031 10.34 6.03031 9.67937Z" fill="#FBBC05"/>
                <path d="M12.0003 23.75C15.1713 23.75 17.9413 22.53 20.0003 20.6406L17.1413 17.29C15.8013 18.5194 14.0213 19.25 12.0003 19.25C9.25031 19.25 6.84031 16.9306 6.03031 14.3206L2.26031 17.7806C4.00031 21.3594 7.72031 23.75 12.0003 23.75Z" fill="#34A853"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="text-center text-sm text-[var(--color-text-muted)] mt-8">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-semibold cursor-pointer text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
