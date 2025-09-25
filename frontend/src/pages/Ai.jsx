import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const Ai = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className='text-center md:mr-[20vw]'>
      <div className="flex items-center justify-start mb-6">
        <Link to="#" onClick={handleGoBack} className="text-gray-400">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-semibold ml-4">AI assistant</h1>
      </div>
    </div>
  );
}

export default Ai;
