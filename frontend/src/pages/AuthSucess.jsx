import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadUser } from '../store/authSlice'; // Import loadUser action

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
          // Store token in localStorage
          localStorage.setItem('token', token);
          // No need to manually set Authorization header here if relying on httpOnly cookie
          // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Fetch user data using the token (axios will automatically send the httpOnly cookie)
          const res = await axios.get('http://localhost:3000/api/auth/me');

          if (res.data && res.data.user) {
            dispatch(loadUser({ user: res.data.user, token }));
            navigate('/'); // Redirect to home page on successful authentication
          } else {
            console.error('Failed to fetch user data: No user in response', res.data);
            navigate('/login?error=Authentication%20failed');
          }
        } catch (error) {
          console.error('Failed to fetch user data or authenticate', error);
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Processing authentication...</p>
    </div>
  );
};

export default AuthSucess;
