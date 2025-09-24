import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Archive from '../pages/Resources';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Ai from '../pages/Ai';
import Autoslide from '../components/Autoslide';
import Sidebar from '../components/Sidebar';
import NotesPage from '../pages/resources/notes/NotesPage';
import SolvedQPage from '../pages/resources/SolvedQues/SolvedQPage';
import SyllabusPage from './../pages/resources/Syllabus/SyllabusPage';
import PyqsPage from '../pages/resources/PYQS/PyqsPage';
import ProfileSettings from '../pages/settings/ProfileSettings';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login'; // Assuming Login component is in ../pages/Login.jsx
import Register from '../pages/Register';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* The Layout component will wrap all routes */}
        <Route path="/" element={<Layout sidebar={<Sidebar />} />}>
          <Route index element={<Home />} />
          <Route path="archive" element={<Archive />} />
          <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="settings" element={<Settings />} />
          <Route path="ai" element={<Ai />} />
          <Route path="autoslide" element={<Autoslide />} />
          <Route path="notespage" element={<NotesPage/>}/>
          <Route path="pyqspage" element={<PyqsPage/>}/>
          <Route path="solvedqpage" element={<SolvedQPage/>}/>
          <Route path="syllabus" element={<SyllabusPage/>}/>
          <Route path="profilesettings" element={<PrivateRoute><ProfileSettings/></PrivateRoute>}/>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
