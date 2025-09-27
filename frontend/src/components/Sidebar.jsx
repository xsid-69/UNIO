import React from 'react';
import { FaHome, FaSignInAlt } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { LuTrainFront } from "react-icons/lu";
import { IoSettingsSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;

  return (
    <div className="flex flex-col items-center py-3 gap-8">
      {/* Placeholder for Sidebar icons */}
      <div className="w-15 h-15 bg-black rounded-xl mb-8"><img src="icon.png" alt="" /></div>
      <div className="flex justify-center items-center flex-col gap-6">
        <Link className='flex flex-col items-center p-2 rounded-lg hover:bg-[#3d4261]' to={"/"}>
          <button className="w-9 h-9 bg-[#3d4261] rounded-lg flex justify-center items-center" ><FaHome /></button>
          <h2>Home</h2>
        </Link>
        <Link className='flex flex-col items-center p-2 rounded-lg hover:bg-[#3d4261]' to={"/archive"}>
          <button className="w-8 h-8 bg-[#3d4261] rounded-lg flex justify-center items-center" ><GrResources /></button>
          <h2>Resources</h2>
        </Link>
        <Link className='flex flex-col items-center p-2 rounded-lg hover:bg-[#3d4261]' to={"/ai"}>
          <button className="w-8 h-8 bg-[#3d4261] rounded-lg flex justify-center items-center" ><LuTrainFront /></button>
          <h2>AI Features</h2>
        </Link>
        {isLoggedIn ? (
          <>
            <Link className='flex flex-col items-center p-2 rounded-lg hover:bg-[#3d4261]' to={"/profilesettings"}>
              <button className="w-8 h-8 bg-[#3d4261] rounded-lg flex justify-center items-center" ><CgProfile /></button>
              <h2>Profile</h2>
            </Link>
            <Link className='flex flex-col items-center p-2 rounded-lg hover:bg-[#3d4261]' to={"/settings"}>
              <button className="w-8 h-8 bg-[#3d4261] rounded-lg flex justify-center items-center" ><IoSettingsSharp /></button>
              <h2>Settings</h2>
            </Link>
          </>
        ) : (
          <Link className='flex flex-col items-center p-2 rounded-lg hover:bg-[#3d4261]' to={"/login"}>
            <button className="w-8 h-8 bg-[#3d4261] rounded-lg flex justify-center items-center" ><FaSignInAlt /></button>
            <h2>Login</h2>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
