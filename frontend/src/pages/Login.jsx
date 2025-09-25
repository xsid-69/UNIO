import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../store/authSlice';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);
  const { login } = useAuth();


  const loginHandler = (data) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (user) {
      // Assuming the user object contains the token
      // If the token is nested, you might need to adjust this (e.g., user.token)
      login(user.token || 'dummy-token'); // Use a dummy token if real one isn't available
      navigate('/');
    }
  }, [user, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center  text-white p-4 relative overflow-hidden">
      {/* Abstract background shapes - simplified for Tailwind */}
      <div className="absolute inset-0 opacity-15">
        <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 0L1540 0L1540 800L-100 800L-100 0Z" fill="url(#paint0_linear_1_2)"/>
          <path d="M100 0L1340 0L1340 800L100 800L100 0Z" fill="url(#paint1_linear_1_2)"/>
          <defs>
            <linearGradient id="paint0_linear_1_2" x1="720" y1="0" x2="720" y2="800" gradientUnits="userSpaceOnUse">
              <stop stopColor="#222748"/>
              <stop offset="1" stopColor="#181f2a"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1_2" x1="720" y1="0" x2="720" y2="800" gradientUnits="userSpaceOnUse">
              <stop stopColor="#222748"/>
              <stop offset="1" stopColor="#181f2a"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl mx-auto bg-[#222748]/50 backdrop-blur-md rounded-xl shadow-lg p-8 lg:p-16">
        {/* Left Section: Welcome */}
        <div className="flex-1 text-center lg:text-left lg:pr-16 mb-10 lg:mb-0">
          <div className="text-4xl font-bold mb-4">
            <span className="text-[#13c4a3]">UNIO</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">Welcome!</h1>
          <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto lg:mx-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <button className="bg-[#13c4a3] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#10a080] transition-colors">
            Learn More
          </button>
        </div>

        {/* Right Section: Sign In Form */}
        <div className="w-full max-w-md bg-[#222748]/70 p-8 rounded-xl shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-8">Sign in</h2>
          <form onSubmit={handleSubmit(loginHandler)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                {...register('email', { required: true })}
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-[#181f2a] border border-[#3a446e] focus:outline-none focus:border-[#13c4a3] text-white"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                {...register('password', { required: true })}
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="********"
                className="w-full px-4 py-3 rounded-lg bg-[#181f2a] border border-[#3a446e] focus:outline-none focus:border-[#13c4a3] text-white"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white
                         bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] hover:from-[#fe6b4e] hover:to-[#fd9e5e] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <button
              onClick={() => window.open("http://localhost:3000/api/auth/google", "_self")}
              type="button"
              className="w-full py-3 rounded-lg font-semibold text-white bg-[#181f2a] border border-[#3a446e] flex items-center justify-center space-x-2 hover:bg-[#3a446e] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.0003 4.75C14.0213 4.75 15.8013 5.49062 17.1413 6.71937L20.0003 3.86062C17.9413 1.97062 15.1713 0.75 12.0003 0.75C7.72031 0.75 4.00031 3.14062 2.26031 6.71937L6.03031 9.67937C6.84031 7.06937 9.25031 4.75 12.0003 4.75Z" fill="#EA4335"/>
                <path d="M21.9997 12.25C21.9997 11.59 21.9397 10.98 21.8297 10.38H12.0003V14.38H17.4003C17.1897 15.57 16.4397 16.59 15.3497 17.29L19.1197 20.25C21.3097 18.27 22.6997 15.45 22.6997 12.25H21.9997V12.25Z" fill="#4285F4"/>
                <path d="M6.03031 9.67937L2.26031 6.71937C1.56031 8.41937 1.18031 10.28 1.18031 12.25C1.18031 14.22 1.56031 16.0806 2.26031 17.7806L6.03031 14.8206C5.79031 14.1606 5.66031 13.42 5.66031 12.25C5.66031 11.08 5.79031 10.34 6.03031 9.67937Z" fill="#FBBC05"/>
                <path d="M12.0003 23.75C15.1713 23.75 17.9413 22.53 20.0003 20.6406L17.1413 17.29C15.8013 18.5194 14.0213 19.25 12.0003 19.25C9.25031 19.25 6.84031 16.9306 6.03031 14.3206L2.26031 17.7806C4.00031 21.3594 7.72031 23.75 12.0003 23.75Z" fill="#34A853"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-8 ">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-semibold cursor-pointer text-[#13c4a3] hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
