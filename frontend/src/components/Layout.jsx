import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavbar from './BottomNavbar';

export default function Layout({ sidebar, rightPanel }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  return (
  <div className="w-full h-screen bg-gradient-to-tr text-white from-black via-slate-900 to-black">
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
  <div className="grid grid-cols-1 md:grid-cols-[96px_1fr_0] lg:grid-cols-[96px_1fr_340px] grid-rows-1 h-full ">
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
        <main className="p-10 md:w-[70vw]">
          <Outlet />
        </main>
        {/* Profile Aside for desktop */}
        <aside
          id="Profile"
          className="hidden md:flex flex-col items-center bg-[#222748]/10 backdrop-blur-md w-[22vw]  p-8 text-white overflow-y-auto"
        >
          <div className="relative w-full h-[20vh]  my-8">
            <img
              src="https://i.pinimg.com/736x/ee/63/79/ee63793a7276d8682064080a725953c4.jpg" // Placeholder image
              alt="Profile"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25vh] h-[25vh] rounded-full border-4 border-white object-cover"
            />
          </div>
          <h2 className="text-xl font-bold mb-1">Siddhant Wankhade</h2>
          <p className="text-gray-400 text-sm flex items-center gap-1 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Nagpur, India
          </p>

          <div className="flex justify-around w-full mb-6">
            <div className="text-center">
              <p className="font-bold text-lg">69</p>
              <p className="text-gray-400 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">69.69M</p>
              <p className="text-gray-400 text-sm">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">69</p>
              <p className="text-gray-400 text-sm">Following</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6 w-full">
            <button className="flex-1 bg-[#13c4a3] text-white py-2 rounded-lg font-semibold">Follow</button>
            <button className="flex-1 border border-[#13c4a3] text-[#13c4a3] py-2 rounded-lg font-semibold">Message</button>
          </div>

          <p className="text-gray-400 text-sm text-center mb-6">
            A young, talented Engineer from Akola City. Glad to work with you at your Company and let's make it Crazzy!
          </p>

         
        </aside>
        {/* Profile Circle for mobile */}
        <>
          <button
            className="md:hidden fixed top-4 right-4 z-50 w-14 h-14 bg-[#232946]  rounded-full flex items-center justify-center shadow-lg border-2 border-[#13c4a3] text-white text-lg font-bold"
            onClick={() => setProfileOpen(true)}
            aria-label="Open profile panel"
          >
            P
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
              <div className="relative w-full h-[20vh]   my-3 text-white">
                <img
                  src="https://i.pinimg.com/736x/ee/63/79/ee63793a7276d8682064080a725953c4.jpg" // Placeholder image
                  alt="Profile"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20vh] h-[20vh] my-3 rounded-full border-4 border-white object-cover"
                />
              </div>
              <h2 className="text-xl font-bold mb-1">Siddhant Wankhade</h2>
              <p className="text-white text-sm flex items-center gap-1 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Nagpur, India
              </p>

              <div className="flex justify-around w-full mb-6">
                <div className="text-center">
                  <p className="font-bold text-lg">69</p>
                  <p className="text-gray-400 text-sm">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">69.69M</p>
                  <p className="text-gray-400 text-sm">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">69</p>
                  <p className="text-white text-sm">Following</p>
                </div>
              </div>

              <div className="flex gap-4 mb-6 w-full">
                <button className="flex-1 bg-[#13c4a3] text-white py-2 rounded-lg font-semibold">Follow</button>
                <button className="flex-1 border border-[#13c4a3] text-[#13c4a3] py-2 rounded-lg font-semibold">Message</button>
              </div>

              <p className="text-gray-400 text-sm text-center mb-6">
                 A young, talented Engineer from Akola City. Glad to work with you at your Company and let's make it Crazzy!
              </p>

              
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
