import React from 'react';
import { FaHome } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { LuTrainFront } from "react-icons/lu";
import { IoSettingsSharp } from "react-icons/io5";
import { Link, useLocation } from 'react-router-dom';

const BottomNavbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon }) => (
    <Link to={to} className="relative flex flex-col items-center justify-center w-full h-full">
      <div className={`text-2xl transition-all duration-300 ${isActive(to) ? 'text-[var(--color-primary)] -translate-y-1' : 'text-gray-400'}`}>
        {icon}
      </div>
      {isActive(to) && (
        <span className="absolute bottom-2 w-1 h-1 bg-[var(--color-primary)] rounded-full animate-pulse" />
      )}
    </Link>
  );

  return (
    <div className="fixed bottom-4 left-4 right-4 h-16 glass-card rounded-2xl md:hidden flex justify-around items-center z-50 px-2 shadow-2xl border border-[var(--color-border)]">
      <NavItem to="/" icon={<FaHome />} />
      <NavItem to="/archive" icon={<GrResources />} />
      <NavItem to="/ai" icon={<LuTrainFront />} />
      <NavItem to="/settings" icon={<IoSettingsSharp />} />
    </div>
  );
};

export default BottomNavbar;
