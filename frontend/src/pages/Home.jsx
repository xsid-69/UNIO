import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SpotlightCard from '../components/Spotlight'; // Import SpotlightCard
import Autoslide from '../components/Autoslide'; // New import
import { IoNewspaperOutline } from "react-icons/io5";
import { GrNotes } from "react-icons/gr";
import { BsRobot } from "react-icons/bs";
import { FaBookOpen, FaRoad } from "react-icons/fa";

// Placeholder components for other tabs
const LearningContent = () => <div className='text-center md:mr-[20vw]'>Learning Content</div>;
const ResourcesContent = () => <div className='text-center md:mr-[20vw]'>Resources Content</div>;

const Home = () => {
  const [activeTab, setActiveTab] = useState('Trending'); // Default active tab
  return (
    <>
      {/* Welcome Block */}
      <div className="mt-5 md:mb-8 ">
        <h1 className="text-3xl font-bold">Hello, xSid</h1>
        <p className="text-gray-400">Welcome back to unio</p>
      </div>

      <div id='slider' className="w-full md:w-[65vw] h-[20vh] md:h-[25vh] bg-transparent rounded-3xl  mb-5">
        <h2 className="text-xl font-semibold mb-2">Featured</h2>
        <Autoslide />
      </div>

      {/* Tabs */}
      <div id='Tabs' className="mt-15 md:mt-10 mb-7 flex gap-6 ">
        <button
          className={`pb-2 ${activeTab === 'Trending' ? 'text-white border-b-2 border-[#13c4a3]' : 'text-gray-400'}`}
          onClick={() => setActiveTab('Trending')}
        >
          Trending
        </button>
        
        
        <button
          className={`pb-2 ${activeTab === 'Resources' ? 'text-white border-b-2 border-[#13c4a3]' : 'text-gray-400'}`}
          onClick={() => setActiveTab('Resources')}
        >
          Resources
        </button>
        
        <button
          className={`pb-2 ${activeTab === 'Ai' ? 'text-white border-b-2 border-[#13c4a3]' : 'text-gray-400'}`}
          onClick={() => setActiveTab('Ai')}
        >
          Ai🤖
        </button>
      </div>

      {/* Conditionally rendered content based on activeTab */}
      {activeTab === 'Trending' && (
        <div id='features' className="grid grid-cols-2 gap-6 md:flex">
         
            <Link className=' w-full h-full' >
               <SpotlightCard className="custom-spotlight-card w-full h-[20vh] md:h-[35vh]" spotlightColor="rgba(0, 229, 255, 0.2)">
             <IoNewspaperOutline className= " text-4xl md:text-6xl mb-2" />
             <h1 className='font-extrabold mt-10 text-2xl md:mt-15 md:text-3xl'>Trending Item 1</h1>
            </SpotlightCard>
            </Link>
            <Link className=' w-full h-full' >
               <SpotlightCard className="custom-spotlight-card w-full h-[20vh] md:h-[35vh]" spotlightColor="rgba(0, 229, 255, 0.2)">
             <GrNotes className= " text-4xl md:text-6xl mb-2" />
             <h1 className='font-extrabold mt-10 text-2xl md:mt-15 md:text-3xl'>Trending Item 2</h1>
            </SpotlightCard>
            </Link>
            <Link className=' w-full h-full' >
               <SpotlightCard className="custom-spotlight-card w-full h-[20vh] md:h-[35vh]" spotlightColor="rgba(0, 229, 255, 0.2)">
             <BsRobot className= " text-4xl md:text-6xl mb-2" />
             <h1 className='font-extrabold mt-10 text-2xl md:mt-15 md:text-3xl'>Trending Item 3</h1>
            </SpotlightCard>
            </Link>
            <Link className=' w-full h-full' >
               <SpotlightCard className="custom-spotlight-card w-full h-[20vh] md:h-[35vh]" spotlightColor="rgba(0, 229, 255, 0.2)">
             <FaBookOpen className= " text-4xl md:text-6xl mb-2"/>
             <h1 className='font-extrabold mt-10 text-2xl md:mt-15 md:text-3xl'>Trending Item 4</h1>
            </SpotlightCard>
            </Link>
          
        </div>
      )}
      {activeTab === 'Ai' && (
        <div id='features' className="grid grid-cols-2 gap-6 md:flex">
          
          <Link className=' w-full h-full' to="/ai"  target="_blank"  >
             <SpotlightCard className="custom-spotlight-card w-full h-[20vh] md:h-[35vh]" spotlightColor="rgba(0, 229, 255, 0.2)">
                <BsRobot className= " text-4xl md:text-6xl mb-2" />
                <h1 className='font-extrabold mt-10 text-2xl md:mt-15 md:text-3xl'> AI Assistant</h1>
          </SpotlightCard>
          </Link>
          <Link className=' w-full h-full'  >
             <SpotlightCard className="custom-spotlight-card w-full h-[20vh] md:h-[35vh]" spotlightColor="rgba(0, 229, 255, 0.2)">
                 <FaRoad className= " text-4xl md:text-6xl mb-2" />
                <h1 className='font-extrabold mt-10 text-2xl md:mt-15 md:text-3xl'> RoadMap.sh</h1>
          </SpotlightCard>
          </Link>
        </div>
      )}
      
      {activeTab === 'Resources' && (
        <div id='features' className="grid grid-cols-2 gap-6 md:flex">
          <Link className=' w-full h-full' to={"/pyqspage"} >
             <SpotlightCard className="custom-spotlight-card w-full h-[20vh] md:h-[35vh]" spotlightColor="rgba(0, 229, 255, 0.2)">
            <IoNewspaperOutline className= " text-4xl md:text-6xl mb-2" />
             <h1 className='font-extrabold mt-10 text-2xl md:mt-15 md:text-3xl'>PYQs</h1>
          </SpotlightCard>
          </Link>
          <Link className=' w-full h-full' to={"/notespage"}>
             <SpotlightCard className="custom-spotlight-card w-full h-[20vh] md:h-[35vh]" spotlightColor="rgba(0, 229, 255, 0.2)">
           <GrNotes className= " text-4xl md:text-6xl mb-2" />
           <h1 className='font-extrabold mt-10 text-2xl md:mt-15 md:text-3xl'>Notes</h1>
          </SpotlightCard>
          </Link>
          
          <Link className=' w-full h-full' to={"/syllabus"} >
             <SpotlightCard className="custom-spotlight-card w-full h-[20vh] md:h-[35vh]" spotlightColor="rgba(0, 229, 255, 0.2)">
           <FaBookOpen className= " text-4xl md:text-6xl mb-2"/>
            <h1 className='font-extrabold mt-10 text-2xl md:mt-15 md:text-3xl'>Syllabus</h1>
          </SpotlightCard>
          </Link>
        </div>
      )}
    </>
  );
};

export default Home;
