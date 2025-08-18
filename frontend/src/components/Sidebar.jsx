import React from 'react';

const Sidebar = () => {
  return (
    <div className="flex flex-col items-center py-3 gap-8">
      {/* Placeholder for Sidebar icons */}
      <button className="w-12 h-12 bg-[#3d4261] rounded-xl mb-8" />
      <div className="flex flex-col gap-6">
        <div className='text-center'>
          <button className="w-8 h-8 bg-[#3d4261] rounded-lg" ></button>
          <h2>Home</h2>
        </div>
        <div className='text-center'>
          <button className="w-8 h-8 bg-[#3d4261] rounded-lg" ></button>
          <h2>Resources</h2>
        </div>
        <div className='text-center'>
          <button className="w-8 h-8 bg-[#3d4261] rounded-lg" ></button>
          <h2>AI Features</h2>
        </div>
        <div className='text-center'>
          <button className="w-8 h-8 bg-[#3d4261] rounded-lg" ></button>
          <h2>Settings</h2>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
