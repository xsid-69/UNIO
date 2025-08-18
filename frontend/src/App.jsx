import React from 'react';
import AppRoutes from './routes/AppRoutes';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';

const App = () => {
  return (
    
    <div className='bg-gradient-to-tr from-black via-slate-900 to-black text-white min-h-screen'>
      <AppRoutes sidebar={<Sidebar/>} />
    </div>
  )
};

export default App;
