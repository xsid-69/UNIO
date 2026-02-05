import React from 'react';
import { FaHome, FaSignInAlt } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { LuTrainFront } from "react-icons/lu";
import { IoSettingsSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import logo from "../Unitech.png";


const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Reusable Link Component with Micro-interactions
  const SidebarItem = ({ to, icon, label }) => (
    <Link 
      to={to} 
      className="flex flex-col items-center group relative p-2"
    >
      <div 
        className={`w-10 h-10 rounded-xl flex justify-center items-center mb-1.5 transition-all duration-300 relative z-10
        ${isActive(to) 
          ? 'bg-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(19,196,163,0.4)]' 
          : 'bg-[var(--color-surface-hover)] text-gray-400 group-hover:bg-[#334155] group-hover:text-white'
        }`}
      >
        <motion.div
           whileHover={{ scale: 1.2 }}
           whileTap={{ scale: 0.9 }}
        >
          {React.cloneElement(icon, { size: 18 })}
        </motion.div>
      </div>
      
      {/* Label with scale effect */}
       <motion.span 
         animate={{ scale: isActive(to) ? 1.05 : 1 }}
         className={`text-[10px] font-medium tracking-wide transition-colors ${isActive(to) ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}
       >
        {label}
      </motion.span>
      
      {/* Active Indicator Dot */}
      {isActive(to) && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--color-primary)] rounded-r-lg"
        />
      )}
    </Link>
  );

  return (
    <div className="flex flex-col items-center py-6 gap-6 w-full">
      {/* Brand Icon with Pulse */}
      <motion.div 
        whileHover={{ rotate: 1, scale: 1.1 }}
        className="w-16 h-16 rounded-2xl mb-6 shadow-lg flex items-center justify-center cursor-pointer"
      >
         <img src={logo} alt="UNITECH" className="w-18 h-18 object-contain drop-shadow-md" />
      </motion.div>

      <div className="flex flex-col gap-4 w-full items-center">
        <SidebarItem to="/" icon={<FaHome />} label="Home" />
        <SidebarItem to="/archive" icon={<GrResources />} label="Resources" />
        <SidebarItem to="/ai" icon={<LuTrainFront />} label="AI" />
        
        <div className="w-10 h-[1px] bg-[var(--glass-border)] my-2"></div>

        {isLoggedIn ? (
          <>
            <SidebarItem to="/profilesettings" icon={<CgProfile />} label="Profile" />
            <SidebarItem to="/settings" icon={<IoSettingsSharp />} label="Settings" />
          </>
        ) : (
          <SidebarItem to="/login" icon={<FaSignInAlt />} label="Login" />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
