
// src/components/SubmissionItem.jsx
import React from 'react';
import { FaCheckCircle, FaFileAlt, FaCode } from 'react-icons/fa';

const getStatusConfig = (status) => {
  switch (status) {
    case 'accepted': return { icon: <FaCheckCircle />, color: 'bg-green-500/10 text-green-400 border-green-500/20' };
    case 'wrong_answer': return { icon: <FaFileAlt />, color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    case 'compilation_error': return { icon: <FaCode />, color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
    default: return { icon: <FaFileAlt />, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  }
};

const SubmissionItem = ({ submission }) => (
  <div className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700/60 transition-all duration-300 cursor-pointer group border border-slate-700 hover:border-indigo-500/50">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-md font-semibold text-white group-hover:text-indigo-400">{submission.problemTitle}</h3>
      <span className="text-xs font-medium text-white px-2 py-1 rounded-full bg-slate-600 capitalize">{submission.language}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize flex items-center gap-1.5 ${getStatusConfig(submission.status).color}`}>
        {getStatusConfig(submission.status).icon} {submission.status.replace(/_/g, ' ')}
      </span>
      <span className="text-xs text-slate-400">{new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
    </div>
  </div>
);

export default SubmissionItem;