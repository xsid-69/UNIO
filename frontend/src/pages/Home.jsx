import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SpotlightCard from '../components/Spotlight';
import Autoslide from '../components/Autoslide';
import { IoNewspaperOutline } from "react-icons/io5";
import { GrNotes } from "react-icons/gr";
import { BsRobot } from "react-icons/bs";
import { FaBookOpen, FaRoad } from "react-icons/fa";
import { useSelector } from 'react-redux';

const Home = () => {
  const [activeTab, setActiveTab] = useState('Trending');
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="mx-auto max-w-7xl animate-[fadeIn_0.5s_ease-out]">
      {/* Welcome Block */}
      <div className="mt-5 mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Hello, {user?.name || 'Student'}</h1>
        <p className="text-[var(--color-text-muted)] mt-2">Welcome back to UNIO. Ready to learn?</p>
      </div>

      <div id='slider' className="w-full h-[22vh] md:h-[30vh] glass-card rounded-3xl mb-10 overflow-hidden relative border border-[var(--glass-border)] shadow-2xl">
        <div className="absolute top-4 left-6 z-10 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10">Featured</div>
        <Autoslide />
      </div>

      {/* Tabs */} 
      <div id='Tabs' className="mb-8 flex gap-8 border-b border-[var(--glass-border)]">
        {['Trending', 'Resources', 'Ai'].map((tab) => (
          <button
            key={tab}
            className={`pb-3 text-sm font-semibold transition-all duration-300 relative px-2
              ${activeTab === tab 
                ? 'text-[var(--color-primary)]' 
                : 'text-[var(--color-text-muted)] hover:text-white'
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'Ai' ? 'AI Assistant' : tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)] rounded-t-full shadow-[0_-2px_6px_rgba(19,196,163,0.4)]" />
            )}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {activeTab === 'Trending' && (
          <>
             <Link to="/news" className='block h-full group'>
               <SpotlightCard className="h-48 md:h-64 flex flex-col justify-between group-hover:bg-[var(--color-surface-hover)] transition-colors">
                 <div className="text-[var(--color-primary)] opacity-80 group-hover:opacity-100 transition-opacity">
                   <IoNewspaperOutline className="text-5xl" />
                 </div>
                 <h2 className="text-2xl font-bold mt-auto group-hover:translate-x-1 transition-transform">Trending News</h2>
               </SpotlightCard>
             </Link>
             <Link to="/notes" className='block h-full group'>
               <SpotlightCard className="h-48 md:h-64 flex flex-col justify-between group-hover:bg-[var(--color-surface-hover)] transition-colors">
                 <div className="text-blue-400 opacity-80 group-hover:opacity-100 transition-opacity">
                   <GrNotes className="text-5xl" />
                 </div>
                 <h2 className="text-2xl font-bold mt-auto group-hover:translate-x-1 transition-transform">Popular Notes</h2>
               </SpotlightCard>
             </Link>
             <Link to="/ai" className='block h-full group'>
               <SpotlightCard className="h-48 md:h-64 flex flex-col justify-between group-hover:bg-[var(--color-surface-hover)] transition-colors">
                 <div className="text-purple-400 opacity-80 group-hover:opacity-100 transition-opacity">
                   <BsRobot className="text-5xl" />
                 </div>
                 <h2 className="text-2xl font-bold mt-auto group-hover:translate-x-1 transition-transform">AI Chat</h2>
               </SpotlightCard>
             </Link>
             <Link to="/books" className='block h-full group'>
               <SpotlightCard className="h-48 md:h-64 flex flex-col justify-between group-hover:bg-[var(--color-surface-hover)] transition-colors">
                 <div className="text-yellow-400 opacity-80 group-hover:opacity-100 transition-opacity">
                   <FaBookOpen className="text-5xl"/>
                 </div>
                 <h2 className="text-2xl font-bold mt-auto group-hover:translate-x-1 transition-transform">Top Books</h2>
               </SpotlightCard>
             </Link>
          </>
        )}

        {activeTab === 'Ai' && (
          <>
            <Link to="/ai" className='block h-full col-span-1 md:col-span-2 group'>
               <SpotlightCard className="h-48 md:h-64 flex flex-col justify-between group-hover:bg-[var(--color-surface-hover)] transition-colors bg-gradient-to-br from-[var(--glass-bg)] to-purple-900/10">
                  <div className="bg-purple-500/10 p-4 rounded-2xl w-fit text-purple-400">
                    <BsRobot className="text-5xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold group-hover:translate-x-1 transition-transform">AI Assistant</h2>
                    <p className="text-[var(--color-text-muted)] text-sm mt-2">Get instant answers and help with your studies.</p>
                  </div>
               </SpotlightCard>
            </Link>
            <Link to="#" className='block h-full col-span-1 md:col-span-2 group'>
               <SpotlightCard className="h-48 md:h-64 flex flex-col justify-between group-hover:bg-[var(--color-surface-hover)] transition-colors bg-gradient-to-br from-[var(--glass-bg)] to-blue-900/10">
                   <div className="bg-blue-500/10 p-4 rounded-2xl w-fit text-blue-400">
                     <FaRoad className="text-5xl" />
                   </div>
                   <div>
                    <h2 className="text-2xl font-bold group-hover:translate-x-1 transition-transform">Learning Roadmap</h2>
                    <p className="text-[var(--color-text-muted)] text-sm mt-2">Generate a personalized learning path.</p>
                   </div>
               </SpotlightCard>
            </Link>
          </>
        )}
        
        {activeTab === 'Resources' && (
          <>
            <Link to="/pyqspage" className='block h-full group'>
               <SpotlightCard className="h-48 md:h-64 flex flex-col justify-between group-hover:bg-[var(--color-surface-hover)] transition-colors">
                 <div className="text-red-400 opacity-80 group-hover:opacity-100 transition-opacity">
                    <IoNewspaperOutline className="text-5xl" />
                 </div>
                 <h2 className="text-2xl font-bold mt-auto group-hover:translate-x-1 transition-transform">PYQs</h2>
               </SpotlightCard>
            </Link>
            <Link to="/notespage" className='block h-full group'>
               <SpotlightCard className="h-48 md:h-64 flex flex-col justify-between group-hover:bg-[var(--color-surface-hover)] transition-colors">
                 <div className="text-green-400 opacity-80 group-hover:opacity-100 transition-opacity">
                   <GrNotes className="text-5xl" />
                 </div>
                 <h2 className="text-2xl font-bold mt-auto group-hover:translate-x-1 transition-transform">Notes</h2>
               </SpotlightCard>
            </Link>
            <Link to="/syllabus" className='block h-full group'>
               <SpotlightCard className="h-48 md:h-64 flex flex-col justify-between group-hover:bg-[var(--color-surface-hover)] transition-colors">
                  <div className="text-orange-400 opacity-80 group-hover:opacity-100 transition-opacity">
                   <FaBookOpen className="text-5xl"/>
                  </div>
                  <h2 className="text-2xl font-bold mt-auto group-hover:translate-x-1 transition-transform">Syllabus</h2>
               </SpotlightCard>
            </Link>
             {/* Placeholder for symmetry */}
             <div className="block h-full opacity-50 pointer-events-none">
               <SpotlightCard className="h-48 md:h-64 flex items-center justify-center border-dashed">
                 <span className="text-[var(--color-text-muted)]">More coming soon</span>
               </SpotlightCard>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
};

export default Home;
