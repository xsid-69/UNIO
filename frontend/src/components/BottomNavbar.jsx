import React from 'react';
import { FaHome } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { LuTrainFront } from "react-icons/lu";
import { IoSettingsSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';

const BottomNavbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black backdrop-blur-md md:hidden flex justify-around items-center h-16 z-50">
      <Link className='flex flex-col items-center text-white text-xs' to={"/"}>
        <button className="w-9 h-9 bg-[#3d4261] rounded-lg flex justify-center items-center mb-1"><FaHome /></button>
        
      </Link>
      <Link className='flex flex-col items-center text-white text-xs' to={"/archive"}>
        <button className="w-8 h-8 bg-[#3d4261] rounded-lg flex justify-center items-center mb-1"><GrResources /></button>
       
      </Link>
      <Link className='flex flex-col items-center text-white text-xs' to={"/ai"}>
        <button className="w-8 h-8 bg-[#3d4261] rounded-lg flex justify-center items-center mb-1"><LuTrainFront /></button>
       
      </Link>
      <Link className='flex flex-col items-center text-white text-xs' to={"/settings"}>
        <button className="w-8 h-8 bg-[#3d4261] rounded-lg flex justify-center items-center mb-1"><IoSettingsSharp /></button>
       
      </Link>
      <Link className='flex flex-col items-center text-white text-xs' to={"/settings"}>
        <button className="w-8 h-8 bg-[#3d4261] rounded-lg flex justify-center items-center mb-1"><IoSettingsSharp /></button>
       
      </Link>
    </div>
  );
};

export default BottomNavbar;
