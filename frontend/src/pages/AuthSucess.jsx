import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loadUser } from '../store/authSlice'; // Import loadUser action
import Spinner from '../components/Spinner';

const AuthSucess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (token) {
        try {
          // Do NOT store token in localStorage when using httpOnly cookie flows
          // The cookie was already set by the backend (httpOnly). Fetch the user.
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`);

          if (res.data && res.data.user) {
            localStorage.setItem('token', token); // Store token as requested
            dispatch(loadUser({ user: res.data.user, token }));
            toast.success('Logged in successfully');
            navigate('/'); // Redirect to home page on successful authentication
          } else {
            console.error('Failed to fetch user data: No user in response', res.data);
            toast.error('Authentication failed');
            navigate('/login?error=Authentication%20failed');
          }
        } catch (error) {
          console.error('Failed to fetch user data or authenticate', error);
          toast.error('Authentication failed');
          navigate('/login?error=Authentication%20failed');
        }
      } else {
        // If no token, redirect to login
        navigate('/login');
      }
    };

    handleAuth();
  }, [dispatch, navigate]);

  // Optional: You can still use the loading/error state from Redux if needed for display
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size={2} />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-gray-300">Processing authentication...</div>
    </div>
  );
};

export default AuthSucess;
