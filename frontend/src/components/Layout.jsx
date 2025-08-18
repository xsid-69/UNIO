import React, { useState } from 'react';

export default function Layout({ sidebar, mainContent, rightPanel }) {
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
        <main className="p-10">
          {/* Welcome Block */}
          <div className="mt-10 md:mt-5 md:mb-8">
            <h1 className="text-3xl font-bold">Hello, Olivia</h1>
            <p className="text-gray-400">Welcome back to our platform</p>
            
          </div>

          {/* Popular Games */}
          <div className="mb-10 w-[70vw]">
            <h2 className="text-xl font-semibold mb-4">Popular Games</h2>
            <div className="flex gap-8">
              {/* Add your game avatars here */}
              <div className="w-28 h-28 bg-gray-800 rounded-2xl"></div>
              <div className="w-28 h-28 bg-gray-800 rounded-2xl"></div>
              <div className="w-28 h-28 bg-gray-800 rounded-2xl"></div>
              <div className="w-28 h-28 bg-gray-800 rounded-2xl"></div>
              <div className="w-28 h-28 bg-gray-800 rounded-2xl"></div>
            </div>
          </div>

        

          {/* Tabs */}
          <div className="mb-6 flex gap-6">
            <button className="border-b-2 border-[#13c4a3] pb-2">Trending</button>
            <button className="text-gray-400 pb-2">Top Streams</button>
            <button className="text-gray-400 pb-2">Currently Online</button>
            <button className="text-gray-400 pb-2">Global Highlights</button>
          </div>

          {/* Trending List */}
          <div className="flex gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl w-48 h-32"></div>
            ))}
          </div>
        </main>
        {/* Profile Aside for desktop */}
        <aside
          id="Profile"
          className="hidden md:flex bg-[#222748]/10   backdrop-blur-md w-[18vw] rounded-r-3xl p-8 items-center gap-6"
        >
          Profile
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
            <div className="md:hidden fixed top-0 right-0 h-full w-64 bg-[#222748]/10 backdrop-blur-md rounded-l-3xl p-8 z-50 flex flex-col items-center gap-6 transition-transform duration-300 shadow-2xl">
              <button
                className="absolute top-4 left-4 p-2 rounded bg-[#181f2a]"
                onClick={() => setProfileOpen(false)}
                aria-label="Close profile panel"
              >
                <span className="block w-5 h-0.5 bg-white rotate-45 absolute"></span>
                <span className="block w-5 h-0.5 bg-white -rotate-45"></span>
              </button>
              <div className="mt-8">Profile</div>
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
    </div>
  );
}
