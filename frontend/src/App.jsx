import React, { useEffect, useState } from 'react';
import Loader from './components/Loader';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer, toast } from 'react-toastify';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`);
        if (response.data && response.data.user) {
          dispatch(loadUser({ user: response.data.user, token: localStorage.getItem('token') }));
        }
      } catch (error) {
        console.error("Failed to initialize auth state:", error);
        // show a non-intrusive toast so user knows something failed silently
        
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        // Add a delay before setting isLoading to false
        setTimeout(() => {
          setIsLoading(false);
        }, 2000); // 2-second delay
      }
    };
    
  initializeAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-transparent dark">
        <Loader />
      </div>
    );
  }

  return (
    <div className={`relative bg-transparent dark`}>
      <GridBeams className="absolute inset-0 z-0" />
      <div className="relative z-10">
        <AppRoutes sidebar={<Sidebar/>} />
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName={(toastProps) => {
            const base = 'custom-toast';
            const typeClass = toastProps?.type ? ` ${base}--${toastProps.type}` : '';
            return base + typeClass;
          }}
          bodyClassName="custom-toast-body"
          progressClassName="custom-toast-progress"
        />
      </div>
    </div>
  )
};

export default App;
