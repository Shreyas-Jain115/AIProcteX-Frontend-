
// src/pages/student/TestHistory.jsx (Previously MyTests.jsx)
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCheckCircle, FaHourglassStart, FaEye } from 'react-icons/fa';

const MOCK_TEST_HISTORY = [
  { attempt_id: 1, test_id: 101, test_name: 'Frontend Developer Assessment', company_name: 'Tech Innovations Inc.', status: 'Completed', score: 92, total_score: 100 },
  { attempt_id: 2, test_id: 102, test_name: 'Data Structures Challenge', company_name: 'CodeWorks Solutions', status: 'Started', score: null, total_score: 80 },
  { attempt_id: 4, test_id: 104, test_name: 'Java Fundamentals Quiz', company_name: 'Java Experts', status: 'Completed', score: 78, total_score: 100 },
];

const getStatusConfig = (status) => {
  switch (status) {
    case 'Completed': return { icon: <FaCheckCircle />, color: 'bg-blue-500/10 text-blue-400' };
    case 'Started': return { icon: <FaHourglassStart />, color: 'bg-yellow-500/10 text-yellow-400' };
    default: return { icon: <FaHourglassStart />, color: 'bg-slate-500/10 text-slate-400' };
  }
};

const TestHistory = () => {
  const [history] = useState(MOCK_TEST_HISTORY);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = useMemo(() => {
    return history.filter(t =>
      t.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [history, searchTerm]);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Test History</h1>
        <p className="text-slate-400">Review your past test attempts and results.</p>
      </header>
      <div className="mb-6">
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search by test or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 px-4 pl-10 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>
      <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700">
        <div className="divide-y divide-slate-700/50">
          {filteredHistory.map(item => {
            const status = getStatusConfig(item.status);
            return (
              <Link to={`/student/results/${item.attempt_id}`} key={item.attempt_id} className="p-4 block hover:bg-slate-800 transition-colors duration-200 group">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h3 className="font-semibold text-white">{item.test_name}</h3>
                    <p className="text-sm text-slate-400">{item.company_name}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-3 sm:mt-0">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize flex items-center gap-2 ${status.color}`}>
                      {status.icon} {item.status}
                    </span>
                    {item.status === 'Completed' && (
                      <div className="text-lg font-bold text-green-400">
                        {item.score}<span className="text-sm text-slate-400">/{item.total_score}</span>
                      </div>
                    )}
                    <FaEye className="text-slate-500 group-hover:text-indigo-400" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestHistory;