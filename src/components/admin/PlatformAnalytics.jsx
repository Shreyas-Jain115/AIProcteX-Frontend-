// src/pages/admin/PlatformAnalytics.jsx
import React, { useState } from 'react';
import { FaClipboardCheck, FaStar, FaQuestionCircle, FaUsers } from 'react-icons/fa';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

// Mock Data for Analytics (replace with API calls)
const MOCK_ANALYTICS_DATA = {
  stats: {
    totalCompletions: 1845,
    averageScore: '76%',
    totalQuestions: 482,
    userEngagement: '82%',
  },
  difficultyDistribution: [
    { name: 'Easy', value: 250 },
    { name: 'Medium', value: 170 },
    { name: 'Hard', value: 62 },
  ],
  testActivity: [
    { month: 'Jan', tests_taken: 150 },
    { month: 'Feb', tests_taken: 220 },
    { month: 'Mar', tests_taken: 300 },
    { month: 'Apr', tests_taken: 280 },
    { month: 'May', tests_taken: 450 },
    { month: 'Jun', tests_taken: 400 },
  ],
};

const COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Green, Yellow, Red

const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-slate-800/50 p-5 rounded-xl border border-slate-700 hover:border-${color}-500/50 transition-all duration-300 shadow-lg`}>
      <div className="flex justify-between items-center">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-400`}>{icon}</div>
      </div>
      <p className="text-slate-400 text-sm font-medium mt-2">{title}</p>
    </div>
);

const PlatformAnalytics = () => {
  const [data] = useState(MOCK_ANALYTICS_DATA);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Platform Analytics</h1>
        <p className="text-slate-400">An overview of system-wide usage and performance metrics.</p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Test Completions" value={data.stats.totalCompletions.toLocaleString()} icon={<FaClipboardCheck size={20} />} color="indigo" />
        <StatCard title="Platform Average Score" value={data.stats.averageScore} icon={<FaStar size={20} />} color="green" />
        <StatCard title="Total Questions in Bank" value={data.stats.totalQuestions} icon={<FaQuestionCircle size={20} />} color="purple" />
        <StatCard title="Monthly User Engagement" value={data.stats.userEngagement} icon={<FaUsers size={20} />} color="teal" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Test Activity Line Chart */}
        <div className="lg:col-span-3 bg-slate-800/50 rounded-xl shadow-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Monthly Test Activity</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={data.testActivity} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend />
                <Line type="monotone" dataKey="tests_taken" name="Tests Taken" stroke="#818cf8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Distribution Pie Chart */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-xl shadow-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Question Difficulty Distribution</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.difficultyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.difficultyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
