import React from 'react';
import { GrNotes } from "react-icons/gr";
import { AiOutlineFileDone } from "react-icons/ai";
import { FaBookOpen } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import NotesPage from './resources/notes/NotesPage';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const Resources = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='text-4xl text-center '>
      <div className="flex items-center justify-start mb-6">
        <Link to="#" onClick={handleGoBack} className="text-gray-400">
          <ChevronLeft size={24} />
        </Link>
        <h1 className='mb-10 ml-4'>Resources</h1>
      </div>
    <div className="grid grid-cols-4 grid-rows-6 gap-5">
       <Link to={"/pyqspage"} className='rounded-2xl col-span-2 row-span-3 h-[35vh] bg-gray-800  flex items-center justify-center flex-col'>
            <IoNewspaperOutline className= " text-4xl md:text-6xl mb-2" />
                   <h1 className='font-extrabold mt-10 text-2xl md:mt-15 md:text-3xl'>PYQs</h1>
       </Link>
        <Link to={"/notespage"} className='rounded-2xl col-span-2 row-span-3 col-start-1 row-start-4 h-[35vh] bg-gray-800 flex items-center justify-center flex-col'>
            <GrNotes className= " text-4xl md:text-6xl mb-2" />
                 <h1 className='font-extrabold mt-10 text-2xl md:mt-15 md:text-3xl'>Notes</h1>
        </Link>
      <Link to={"/solvedqpage"} className='rounded-2xl col-span-2 row-span-3 col-start-3 row-start-1 flex items-center bg-gray-800 justify-center flex-col'>
          <AiOutlineFileDone className= " text-4xl md:text-6xl mb-2" />
                  <h1 className='font-extrabold mt-10 text-2xl md:mt-15 md:text-3xl'>Solved Ques</h1>
      </Link>
      <Link to={"/syllabus"} className='rounded-2xl col-span-2 row-span-3 col-start-3 row-start-4 flex items-center bg-gray-800 justify-center flex-col'>
          <FaBookOpen className= " text-4xl md:text-6xl mb-2"/>
                  <h1 className='font-extrabold mt-10 text-2xl md:mt-15 md:text-3xl'>Syllabus</h1>
      </Link>
    </div>
    
    </div>
  );
};

export default Resources;
