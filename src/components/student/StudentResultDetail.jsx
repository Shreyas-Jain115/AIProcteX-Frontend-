
// src/pages/student/StudentResultDetail.jsx (NEW)
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaTrophy } from 'react-icons/fa';

const MOCK_RESULT_DETAIL = {
  attempt_id: 1,
  test_name: 'Frontend Developer Assessment',
  company_name: 'Tech Innovations Inc.',
  score: 92,
  total_score: 100,
  status: 'Passed',
  completed_at: '2024-07-30T11:45:00Z',
  problems: [
    { title: 'Build a "useState" Hook from Scratch', score: 25, total: 25 },
    { title: 'CSS Centering Challenge', score: 12, total: 15 },
    { title: 'Debounce Function Implementation', score: 20, total: 20 },
    { title: 'Array Manipulation Problem', score: 20, total: 20 },
    { title: 'Promise Chaining Task', score: 15, total: 20 },
  ]
};

const StudentResultDetail = () => {
  const { attemptId } = useParams();
  const result = MOCK_RESULT_DETAIL;
  const isPassed = result.status === 'Passed';

  return (
    <div>
      <Link to="/student/history" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 mb-6">
        <FaArrowLeft />
        Back to Test History
      </Link>

      <header className="mb-8 p-6 rounded-xl border" style={{ borderColor: isPassed ? '#10B981' : '#EF4444', background: isPassed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold" style={{ color: isPassed ? '#10B981' : '#EF4444' }}>{result.status.toUpperCase()}</p>
            <h1 className="text-3xl font-bold text-white">{result.test_name}</h1>
            <p className="text-slate-400">Completed on: {new Date(result.completed_at).toLocaleDateString()}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-sm">Your Score</p>
            <p className="text-5xl font-bold text-white">{result.score}<span className="text-2xl text-slate-400">/{result.total_score}</span></p>
          </div>
        </div>
      </header>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Problem Breakdown</h2>
        <div className="space-y-2">
          {result.problems.map((problem, index) => (
            <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-white">{problem.title}</h3>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: problem.score === problem.total ? '#10B981' : '#F59E0B' }}>
                {problem.score === problem.total ? <FaCheckCircle /> : <FaTimesCircle />}
                {problem.score} / {problem.total} points
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentResultDetail;
