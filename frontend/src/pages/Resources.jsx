import React from 'react';

const Resources = () => {
  return (
    <div className='text-4xl text-center '>
      <h1 className='mb-10'>Resources</h1>
      
    <div className="grid grid-cols-4 grid-rows-6 gap-5">
    <div className="col-span-2 row-span-3 h-[35vh]">1</div>
    <div className="col-span-2 row-span-3 col-start-1 row-start-4 h-[35vh]">2</div>
    <div className="col-span-2 row-span-3 col-start-3 row-start-1">3</div>
    <div className="col-span-2 row-span-3 col-start-3 row-start-4">4</div>
    </div>
    
    </div>
  );
};

export default Resources;
