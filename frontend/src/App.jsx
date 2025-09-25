import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import { GridBeams } from './components/magicui/grid-beams';
import { useDispatch } from 'react-redux';
import { loadUser } from './store/authSlice';
import axios from 'axios'; // Import axios

// Configure axios to send credentials (cookies)
axios.defaults.withCredentials = true;

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/me');
        if (response.data && response.data.user) {
          dispatch(loadUser({ user: response.data.user, token: localStorage.getItem('token') }));
        }
      } catch (error) {
        console.error("Failed to initialize auth state:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    };
    
    initializeAuth();
  }, [dispatch]);

  return (
    <div className={`relative bg-transparent dark`}>
      <GridBeams className="absolute inset-0 z-0" />
      <div className="relative z-10">
        <AppRoutes sidebar={<Sidebar/>} />
      </div>
    </div>
  )
};

export default App;
