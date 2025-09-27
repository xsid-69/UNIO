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
    <div className='p-4'>
      <div className="flex items-center justify-start mb-6">
        <Link to="#" onClick={handleGoBack} className="text-gray-400">
          <ChevronLeft size={24} />
        </Link>
        <h1 className='text-4xl ml-4 font-bold'>Resources</h1>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-4 grid-rows-6 gap-5">
          <Link to={"/pyqspage"} className='rounded-2xl col-span-2 row-span-3 h-[35vh] bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-lg'>
            <IoNewspaperOutline className="text-4xl md:text-6xl mb-2" />
            <h1 className='font-bold text-2xl md:text-3xl mt-4'>PYQs</h1>
          </Link>
          <Link to={"/notespage"} className='rounded-2xl col-span-2 row-span-3 col-start-1 row-start-4 h-[35vh] bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-lg'>
            <GrNotes className="text-4xl md:text-6xl mb-2" />
            <h1 className='font-bold text-2xl md:text-3xl mt-4'>Notes</h1>
          </Link>
          <Link to={"/solvedqpage"} className='rounded-2xl col-span-2 row-span-3 col-start-3 row-start-1 flex items-center bg-gradient-to-br from-gray-700 to-gray-800 justify-center flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-lg'>
            <AiOutlineFileDone className="text-4xl md:text-6xl mb-2" />
            <h1 className='font-bold text-2xl md:text-3xl mt-4'>Solved Ques</h1>
          </Link>
          <Link to={"/syllabus"} className='rounded-2xl col-span-2 row-span-3 col-start-3 row-start-4 flex items-center bg-gradient-to-br from-gray-700 to-gray-800 justify-center flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-lg'>
            <FaBookOpen className="text-4xl md:text-6xl mb-2" />
            <h1 className='font-bold text-2xl md:text-3xl mt-4'>Syllabus</h1>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Resources;
