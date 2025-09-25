import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BottomNavbar from './BottomNavbar';
import Profile from '../pages/Profile';
import { useSelector } from 'react-redux';

export default function Layout({ sidebar, rightPanel }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login');
  };


  return (
    <div className="w-full h-screen">
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-[#222748]"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <span className="block w-6 h-0.5 bg-white mb-1"></span>
        <span className="block w-6 h-0.5 bg-white mb-1"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[96px_1fr_0] lg:grid-cols-[96px_1fr_340px] grid-rows-1 h-full">
        {/* Sidebar */}
        {/* Mobile: hidden unless open, Desktop: always visible */}
        <aside
          className={`bg-[#222748]/10 backdrop-blur-md flex flex-col items-center py-8 gap-8 rounded-l-3xl
            fixed top-0 left-0 h-full z-40 transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:static md:translate-x-0 md:flex md:w-[96px] w-64
          `}
        >
          {/* Close button for mobile */}
          <button
            className="md:hidden absolute top-4 right-4 p-2 rounded bg-transparent"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <span className="block w-5 h-0.5 bg-white rotate-45 absolute"></span>
            <span className="block w-5 h-0.5 bg-white -rotate-45"></span>
          </button>
          {sidebar}
        </aside>
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-transparent z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
        )}
        {/* Main Section */}
        <main className="md:p-10 p-10  md:w-[70vw]">
          <Outlet />
        </main>
        {/* Profile Aside for desktop */}
        <aside
          id="Profile"
          className="hidden md:flex flex-col items-center bg-[#222748]/10 backdrop-blur-md w-[22vw] p-8 text-white overflow-y-auto"
        >
          {isLoggedIn ? (
            <Profile />
          ) : (
            <div className="text-center">
              <button
                onClick={handleSignInClick}
                className="bg-[#13c4a3] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#10a080] transition-colors"
              >
                Sign in now
              </button>
            </div>
          )}
        </aside>
        {/* Profile Circle for mobile */}
        <>
          <button
            className="md:hidden fixed top-4 right-4 z-50 w-14 h-14 bg-[#232946] rounded-full flex items-center justify-center shadow-lg border-2 border-[#13c4a3] text-white text-lg font-bold"
            onClick={() => setProfileOpen(true)}
            aria-label="Open profile panel"
          >
            {isLoggedIn ? 'P' : 'Sign In'}
          </button>
          {/* Slide-in Profile panel for mobile */}
          {profileOpen && (
            <div className="md:hidden fixed top-0 right-0 h-full w-64 bg-[#222748]/10 backdrop-blur-md rounded-l-3xl p-8 z-50 flex flex-col items-center gap-6 transition-transform duration-300 shadow-2xl overflow-y-auto">
              <button
                className="absolute top-4 left-4 p-2 rounded bg-[#181f2a]"
                onClick={() => setProfileOpen(false)}
                aria-label="Close profile panel"
              >
                <span className="block w-5 h-0.5 bg-white rotate-45 absolute"></span>
                <span className="block w-5 h-0.5 bg-white -rotate-45"></span>
              </button>
              {/* Profile Content for mobile */}
              {isLoggedIn ? (
                <Profile />
              ) : (
                <div className="text-center">
                  <button
                    onClick={handleSignInClick}
                    className="bg-[#13c4a3] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#10a080] transition-colors"
                  >
                    Sign in now
                  </button>
                </div>
              )}
            </div>
          )}
          {/* Overlay for mobile profile panel */}
          {profileOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setProfileOpen(false)}
              aria-label="Close profile overlay"
            />
          )}
        </>
      </div>
      <BottomNavbar />
    </div>
  );
}
