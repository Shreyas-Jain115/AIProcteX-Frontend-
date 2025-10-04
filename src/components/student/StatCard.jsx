
// src/components/StatCard.jsx
import React from 'react';
import { RiTestTubeFill } from 'react-icons/ri';
import { FaChartLine, FaCheckCircle } from 'react-icons/fa';
import { BsCodeSlash } from 'react-icons/bs';

const ICONS = {
  indigo: <RiTestTubeFill size={20} />,
  green: <FaChartLine size={20} />,
  purple: <BsCodeSlash size={20} />,
  teal: <FaCheckCircle size={20} />,
};

const StatCard = ({ title, value, progress, color }) => (
  <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 shadow-lg">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1 text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-400`}>
        {ICONS[color]}
      </div>
    </div>
    {progress && (
      <div className="mt-4">
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div className={`bg-${color}-500 h-1.5 rounded-full`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    )}
  </div>
);

export default StatCard;