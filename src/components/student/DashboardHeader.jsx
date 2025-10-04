import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

const DashboardHeader = ({ user }) => (
  <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
    <div className="flex items-center mb-4 md:mb-0">
      <div className={`${user.avatarColor} w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold mr-4 border-2 border-slate-700`}>
        {user.username.charAt(0)}
      </div>
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, {user.username}</h1>
        <p className="text-slate-400">Here's your performance snapshot.</p>
      </div>
    </div>
    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 flex items-center shadow-lg shadow-indigo-500/10">
      <span>Explore Tests</span>
      <FaExternalLinkAlt className="ml-2 text-xs" />
    </button>
  </header>
);

export default DashboardHeader;