// src/pages/company/CandidateManagement.jsx
import React, { useState, useMemo } from 'react';
import { FaSearch, FaFilter, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

// Mock Data for Candidates (replace with an API call)
const MOCK_CANDIDATES = [
  { id: 1, name: 'Alice Johnson', email: 'alice.j@example.com', test_taken: 'Senior Frontend Engineer', score: 88, status: 'Passed' },
  { id: 2, name: 'Bob Williams', email: 'bob.w@example.com', test_taken: 'Senior Frontend Engineer', score: 65, status: 'Failed' },
  { id: 3, name: 'Charlie Brown', email: 'charlie.b@example.com', test_taken: 'Backend Python Developer', score: 92, status: 'Passed' },
  { id: 4, name: 'Diana Miller', email: 'diana.m@example.com', test_taken: 'Full-Stack Assessment', score: 75, status: 'Passed' },
  { id: 5, name: 'Ethan Davis', email: 'ethan.d@example.com', test_taken: 'Backend Python Developer', score: 58, status: 'Failed' },
  { id: 6, name: 'Fiona Garcia', email: 'fiona.g@example.com', test_taken: 'DevOps Screening', score: null, status: 'In Review' },
];

const getStatusConfig = (status) => {
  switch (status) {
    case 'Passed': return { icon: <FaCheckCircle />, color: 'bg-green-500/10 text-green-400' };
    case 'Failed': return { icon: <FaTimesCircle />, color: 'bg-red-500/10 text-red-400' };
    case 'In Review': return { icon: <FaHourglassHalf />, color: 'bg-yellow-500/10 text-yellow-400' };
    default: return { icon: <FaHourglassHalf />, color: 'bg-slate-500/10 text-slate-400' };
  }
};

const CandidateManagement = () => {
  const [candidates] = useState(MOCK_CANDIDATES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCandidates = useMemo(() => {
    return candidates
      .filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(c => statusFilter === 'all' || c.status === statusFilter);
  }, [candidates, searchTerm, statusFilter]);

  return (
    <div>
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Candidate Management</h1>
          <p className="text-slate-400">View and manage all candidates who have taken your tests.</p>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 px-4 pl-10 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-auto py-2 px-4 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="Passed">Passed</option>
          <option value="Failed">Failed</option>
          <option value="In Review">In Review</option>
        </select>
      </div>

      {/* Candidates List Table */}
      <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700 overflow-x-auto">
        <div className="min-w-full divide-y divide-slate-700/50">
          {/* Table Header */}
          <div className="p-4 hidden md:grid grid-cols-4 gap-4 font-semibold text-slate-400 text-sm">
            <h3>Candidate</h3>
            <h3>Test Taken</h3>
            <h3 className="text-center">Score</h3>
            <h3 className="text-center">Status</h3>
          </div>
          {filteredCandidates.map(candidate => {
            const status = getStatusConfig(candidate.status);
            return (
              <div key={candidate.id} className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center hover:bg-slate-800 transition-colors duration-200">
                {/* Candidate Info */}
                <div className="col-span-2 md:col-span-1">
                  <h3 className="font-semibold text-white">{candidate.name}</h3>
                  <p className="text-sm text-slate-400">{candidate.email}</p>
                </div>
                {/* Test Taken */}
                <div className="text-slate-300 text-sm">{candidate.test_taken}</div>
                {/* Score */}
                <div className="text-center font-bold text-white">
                  {candidate.score !== null ? `${candidate.score}%` : 'N/A'}
                </div>
                {/* Status */}
                <div className="flex justify-center">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize flex items-center gap-2 ${status.color}`}>
                    {status.icon} {candidate.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        {filteredCandidates.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            No candidates found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateManagement;
