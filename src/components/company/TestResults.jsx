import React, { useState, useMemo } from 'react';
import { FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Mock Data for Test Attempts (replace with an API call)
const MOCK_TEST_ATTEMPTS = [
  { attempt_id: 1, candidate_name: 'Alice Johnson', test_name: 'Senior Frontend Engineer', score: 88, status: 'Passed' },
  { attempt_id: 2, candidate_name: 'Bob Williams', test_name: 'Senior Frontend Engineer', score: 65, status: 'Failed' },
  { attempt_id: 3, candidate_name: 'Charlie Brown', test_name: 'Backend Python Developer', score: 92, status: 'Passed' },
  { attempt_id: 4, candidate_name: 'Diana Miller', test_name: 'Full-Stack Assessment', score: 75, status: 'Passed' },
  { attempt_id: 5, candidate_name: 'Ethan Davis', test_name: 'Backend Python Developer', score: 58, status: 'Failed' },
  { attempt_id: 6, candidate_name: 'Alice Johnson', test_name: 'Data Structures Challenge', score: 95, status: 'Passed' },
  { attempt_id: 7, candidate_name: 'Charlie Brown', test_name: 'DevOps Screening', score: 72, status: 'Passed' },
];

const getStatusConfig = (status) => {
  switch (status) {
    case 'Passed': return { icon: <FaCheckCircle />, color: 'bg-green-500/10 text-green-400' };
    case 'Failed': return { icon: <FaTimesCircle />, color: 'bg-red-500/10 text-red-400' };
    default: return { icon: <FaCheckCircle />, color: 'bg-slate-500/10 text-slate-400' };
  }
};

const TestResults = () => {
  const [attempts, setAttempts] = useState(MOCK_TEST_ATTEMPTS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAttempts = useMemo(() => {
    return attempts.filter(a =>
      a.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.test_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [attempts, searchTerm]);

  return (
    <div>
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Test Results</h1>
          <p className="text-slate-400">Review detailed results for every test attempt.</p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search by candidate or test..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 px-4 pl-10 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700 overflow-x-auto">
        <div className="min-w-full divide-y divide-slate-700/50">
          {/* Table Header */}
          <div className="p-4 hidden md:grid grid-cols-4 gap-4 font-semibold text-slate-400 text-sm">
            <h3>Candidate</h3>
            <h3>Test Taken</h3>
            <h3 className="text-center">Final Score</h3>
            <h3 className="text-center">Result</h3>
          </div>
          {filteredAttempts.map(attempt => {
            const status = getStatusConfig(attempt.status);
            return (
              <div key={attempt.attempt_id} className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center hover:bg-slate-800 transition-colors duration-200">
                <div className="font-semibold text-white">{attempt.candidate_name}</div>
                <div className="text-sm text-slate-300">{attempt.test_name}</div>
                <div className="text-center font-bold text-white">{attempt.score}%</div>
                <div className="flex justify-center">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize flex items-center gap-2 ${status.color}`}>
                    {status.icon} {attempt.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {filteredAttempts.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            No results found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResults;