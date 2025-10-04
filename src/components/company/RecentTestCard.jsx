import React from 'react';
import { FaCheckCircle, FaClock, FaFileAlt, FaCode } from 'react-icons/fa';
import { BsFillLightningFill } from 'react-icons/bs';

const getStatusConfig = (status) => {
  switch (status) {
    case 'completed': return { icon: <FaCheckCircle />, color: 'bg-green-500/10 text-green-400 border-green-500/20' };
    case 'started': return { icon: <FaClock />, color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
    case 'pending': return { icon: <BsFillLightningFill />, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    default: return { icon: <FaFileAlt />, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  }
};

const RecentTestCard = ({ test }) => {
  const statusColor = {
    Active: 'bg-green-500/10 text-green-400',
    Grading: 'bg-yellow-500/10 text-yellow-400',
    Completed: 'bg-slate-500/10 text-slate-400',
  };
  return (
    <div className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700/60 transition-all duration-300 cursor-pointer group border border-slate-700 hover:border-indigo-500/50">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-md font-semibold text-white group-hover:text-indigo-400">{test.name}</h3>
          <p className="text-sm text-slate-400">{test.candidates} Candidates</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[test.status]}`}>{test.status}</span>
      </div>
    </div>
  );
};
export default RecentTestCard;