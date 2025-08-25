import React from 'react';
import AppRoutes from './routes/AppRoutes';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import { GridBeams } from './components/magicui/grid-beams';
import { useTheme } from './context/ThemeContext'; // Import useTheme hook

const App = () => {
  const { theme } = useTheme(); // Get the current theme

  return (
    <div className={`relative bg-transparent ${theme === 'dark' ? 'dark' : 'light'}`}>
      <GridBeams className="absolute inset-0 z-0" />
      <div className="relative z-10">
        <AppRoutes sidebar={<Sidebar/>} />
      </div>
    </div>
  )
};

export default App;
