import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
import SubjectsPage from '../pages/SubjectsPage';
import ProfileSettings from '../pages/settings/ProfileSettings';
import { useSelector } from 'react-redux';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AuthSucess from '../pages/AuthSucess';
import ProfileData from '../pages/settings/ProfileData';
import ResourcesViewer from '../components/ResourcesViewer';
import PageTransition from '../components/PageTransition';

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;
  return isLoggedIn ? children : <Navigate to="/login" />;
};

// Wrapper using useLocation to key transitions
const AnimatedRoutes = () => {
    const location = useLocation();
    
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                <Route path="/auth-success" element={<PageTransition><AuthSucess /></PageTransition>} />
                
                <Route path="/" element={<Layout sidebar={<Sidebar />} />}>
                   <Route index element={<PageTransition><Home /></PageTransition>} />
                   <Route path="archive" element={<PageTransition><Archive /></PageTransition>} />
                   <Route path="profile" element={<PrivateRoute><PageTransition><Profile /></PageTransition></PrivateRoute>} />
                   <Route path="settings" element={<PageTransition><Settings /></PageTransition>} />
                   <Route path="ai" element={<PageTransition><Ai /></PageTransition>} />
                   <Route path="autoslide" element={<PageTransition><Autoslide /></PageTransition>} />
                   <Route path="notespage" element={<PageTransition><NotesPage/></PageTransition>}/>
                   <Route path="/pyqspage" element={<PageTransition><PyqsPage/></PageTransition>}/>
                   <Route path="solvedqpage" element={<PageTransition><SolvedQPage/></PageTransition>}/>
                   <Route path="syllabus" element={<PageTransition><SyllabusPage/></PageTransition>}/>
                   <Route path="profiledata" element={<PageTransition><ProfileData/></PageTransition>}/>
                   <Route path="profilesettings" element={<PrivateRoute><PageTransition><ProfileSettings/></PageTransition></PrivateRoute>}/>
                   <Route path="subjects" element={<PageTransition><SubjectsPage /></PageTransition>} />
                   <Route path="subjects/:subjectId" element={<PageTransition><ResourcesViewer /></PageTransition>} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
};

const AppRoutes = () => {
  return (
    <Router>
        <AnimatedRoutes />
    </Router>
  );
};

export default AppRoutes;
