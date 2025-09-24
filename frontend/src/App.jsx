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
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        dispatch(loadUser({ user, token: storedToken }));
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        // Optionally clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
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
