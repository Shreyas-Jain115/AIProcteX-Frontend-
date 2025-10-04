// src/components/admin/AdminTopbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaSearch, FaCog, FaQuestionCircle, FaChevronDown, FaShieldAlt } from 'react-icons/fa';

const AdminTopbar = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full h-16 bg-slate-900/80 backdrop-blur-sm text-white flex items-center px-6 justify-between flex-shrink-0 border-b border-slate-700/50 sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold text-indigo-400">EduPortal</div>
        <div className="hidden md:block text-sm text-slate-400 border-l border-slate-700 pl-4">
          Administrator Panel
        </div>
      </div>
      <div className="hidden lg:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search users, companies, tests..."
            className="w-full py-2 px-4 pl-10 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>
      <div className="flex items-center space-x-3 md:space-x-5">
        <div className="hidden sm:flex flex-col items-end text-sm leading-tight">
          <div className="font-medium text-slate-300">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs text-slate-500">
            {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-800 transition-colors">
          <FaQuestionCircle className="text-slate-400" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-slate-800 transition-colors"
          onClick={() => navigate('/admin/settings')}
        >
          <FaCog className="text-slate-400" />
        </button>
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-slate-800 transition-colors">
            <FaBell className="text-slate-400" />
          </button>
        </div>
        <div className="flex items-center space-x-2 ml-2 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
          <FaShieldAlt className="text-2xl text-slate-400" />
          <div className="hidden md:block">
            <div className="text-sm font-medium text-slate-200">Admin User</div>
            <div className="text-xs text-slate-500">Administrator</div>
          </div>
          <FaChevronDown className="text-slate-500 text-xs ml-1 hidden md:block" />
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
