import React, { useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer} from 'react-toastify';
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
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.location.replace("/dashboard");
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`);
        if (response.data && response.data.user) {
          dispatch(loadUser({ user: response.data.user, token: token || localStorage.getItem('token') }));
        }
      } catch (error) {
        console.error("Failed to initialize auth state:", error);
        // show a non-intrusive toast so user knows something failed silently
        
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
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
      <div className="w-full h-screen bg-[var(--color-background)] p-4 md:p-10 flex flex-col md:flex-row gap-6 overflow-hidden">
         {/* Skeleton Sidebar Layout mimicking the real one */}
         <div className="hidden md:flex flex-col gap-6 w-[96px] h-full items-center py-6 glass-card rounded-l-3xl border-r border-[var(--glass-border)]">
             <div className="w-10 h-10 bg-[var(--color-surface-hover)] rounded-xl animate-pulse"></div>
             <div className="flex flex-col gap-8 w-full items-center mt-10">
                {[1,2,3,4,5].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-[var(--color-surface-hover)] animate-pulse"></div>)}
             </div>
         </div>
         
         {/* Main Content Skeleton */}
         <div className="flex-1 h-full glass-card rounded-3xl p-8 flex flex-col gap-8 border border-[var(--glass-border)] relative overflow-hidden">
             
             {/* Header Skeleton */}
             <div className="flex justify-between items-center mb-4">
               <div>
                  <div className="h-8 w-48 bg-[var(--color-surface-hover)] rounded-lg animate-pulse mb-3"></div>
                  <div className="h-4 w-32 bg-[var(--color-surface-hover)] rounded-lg animate-pulse"></div>
               </div>
               <div className="w-12 h-12 rounded-full bg-[var(--color-surface-hover)] animate-pulse"></div>
             </div>

             {/* Hero/Slider Skeleton */}
             <div className="h-64 w-full bg-[var(--color-surface-hover)] rounded-2xl animate-pulse opacity-50"></div>
             
             {/* Tabs Skeleton */}
             <div className="flex gap-6 border-b border-[var(--glass-border)] pb-4">
                <div className="h-6 w-24 bg-[var(--color-surface-hover)] rounded-md animate-pulse"></div>
                <div className="h-6 w-24 bg-[var(--color-surface-hover)] rounded-md animate-pulse"></div>
                <div className="h-6 w-24 bg-[var(--color-surface-hover)] rounded-md animate-pulse"></div>
             </div>

             {/* Grid Skeleton */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="h-48 bg-[var(--color-surface-hover)] rounded-2xl animate-pulse opacity-40"></div>
                 ))}
             </div>
         </div>
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
