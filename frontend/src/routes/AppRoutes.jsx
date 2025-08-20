import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Archive from '../pages/Resources';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Ai from '../pages/Ai';
import Autoslide from '../components/Autoslide'; // Assuming Autoslide is in ../components/Autoslide.jsx
import Sidebar from '../components/Sidebar'; // Assuming Sidebar is in ../components/Sidebar.jsx
 // Assuming Chatbot is in ../components/Chatbot.jsx

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* The Layout component will wrap all routes */}
        <Route path="/" element={<Layout sidebar={<Sidebar />} />}>
          <Route index element={<Home />} />
          <Route path="archive" element={<Archive />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="ai" element={<Ai />} />
          <Route path="autoslide" element={<Autoslide />} /> 
          
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
