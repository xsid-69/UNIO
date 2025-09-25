import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import SubjectsList from  '../../../components/SubjectsList';

const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7']; 
const PyqsPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='text-center mt-2 text-4xl h-100'>
      <div className="flex items-center justify-start mb-6">
        <Link to="#" onClick={handleGoBack} className="text-gray-400">
          <ChevronLeft size={24} />
        </Link>
        <h1 className='ml-4'>Previous Year Question Papers</h1>
      </div>
        <div id="subjectLists">
           <SubjectsList
              items={items}
              onItemSelect={(item, index) => console.log(item, index)}
              showGradients={false}
              enableArrowNavigation={true}
              displayScrollbar={false}
           />
        </div>
    </div>
  );
}

export default PyqsPage
