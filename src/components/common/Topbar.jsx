// src/components/Topbar.jsx
import React, { useState, useEffect } from 'react';
import {
  FaUserCircle,
  FaBell,
  FaSearch,
  FaCog,
  FaQuestionCircle,
  FaChevronDown
} from 'react-icons/fa';

const Topbar = () => {
  // State for the current time, updated every second
  const [currentTime, setCurrentTime] = useState(new Date());
  // Example state for notifications
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    // Set up an interval to update the time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    // Clean up the interval when the component unmounts
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full h-16 bg-slate-900/80 backdrop-blur-sm text-white flex items-center px-6 justify-between flex-shrink-0 border-b border-slate-700/50 sticky top-0 z-50">
      
      {/* Left Section: Branding and Title */}
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold text-indigo-400">
          EduPortal
        </div>
        <div className="hidden md:block text-sm text-slate-400 border-l border-slate-700 pl-4">
          Student Dashboard
        </div>
      </div>

      {/* Middle Section: Search Bar */}
      <div className="hidden lg:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full py-2 px-4 pl-10 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {/* Right Section: Actions and User Profile */}
      <div className="flex items-center space-x-3 md:space-x-5">
        
        {/* Time Display */}
        <div className="hidden sm:flex flex-col items-end text-sm leading-tight">
          <div className="font-medium text-slate-300">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs text-slate-500">
            {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Action Icons */}
        <button className="p-2 rounded-full hover:bg-slate-800 transition-colors" aria-label="Help">
          <FaQuestionCircle className="text-slate-400" />
        </button>
        <button className="p-2 rounded-full hover:bg-slate-800 transition-colors" aria-label="Settings">
          <FaCog className="text-slate-400" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-slate-800 transition-colors" aria-label="Notifications">
            <FaBell className="text-slate-400" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 bg-indigo-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                {notifications}
              </span>
            )}
          </button>
        </div>

        {/* User Profile Dropdown */}
        <div className="flex items-center space-x-2 ml-2 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
          <FaUserCircle className="text-2xl text-slate-400" />
          <div className="hidden md:block">
            <div className="text-sm font-medium text-slate-200">Jane Doe</div>
            <div className="text-xs text-slate-500">Student</div>
          </div>
          <FaChevronDown className="text-slate-500 text-xs ml-1 hidden md:block" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
