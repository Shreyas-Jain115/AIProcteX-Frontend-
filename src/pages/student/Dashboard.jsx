import React, { useState, useEffect } from 'react';

// Import all the child components
import DashboardHeader from '../../components/student/DashboardHeader';
import StatCard from '../../components/student/StatCard';
import RecentTestItem from '../../components/student/RecentTestItem';
import SubmissionItem from '../../components/student/SubmissionItem';
import ActivityChart from '../../components/student/ActivityChart';

// In a real app, this data would come from an API
const MOCK_DASHBOARD_DATA = {
  user: {
    username: 'Jane Doe',
    role: 'student',
    joinDate: '2024-01-15',
    avatarColor: 'bg-indigo-500'
  },
  recentTests: [
    { testId: 101, testName: 'Frontend Developer Assessment', companyName: 'Tech Innovations Inc.', status: 'completed', score: 92, totalScore: 100, duration: '45 mins', dateCompleted: '2024-07-30' },
    { testId: 102, testName: 'Data Structures Challenge', companyName: 'CodeWorks Solutions', status: 'started', score: null, totalScore: 80, duration: '60 mins', dateStarted: '2024-07-28' },
    { testId: 103, testName: 'Algorithm Mastery Test', companyName: 'Binary Brains LLC', status: 'pending', score: null, totalScore: 100, duration: '90 mins', deadline: '2024-08-05' }
  ],
  recentSubmissions: [
    { submissionId: 501, problemTitle: 'Two Sum', language: 'python', status: 'accepted', submittedAt: '2024-07-30T10:30:00Z' },
    { submissionId: 502, problemTitle: 'Longest Substring...', language: 'java', status: 'wrong_answer', submittedAt: '2024-07-29T18:45:00Z' },
    { submissionId: 503, problemTitle: 'Merge Sort', language: 'cpp', status: 'compilation_error', submittedAt: '2024-07-29T11:00:00Z' },
  ],
  stats: {
    totalTests: 8,
    completedTests: 5,
    averageScore: 87,
    totalSubmissions: 24,
    acceptanceRate: 75
  },
  activityData: [
    { name: 'Mon', submissions: 4 }, { name: 'Tue', submissions: 3 }, { name: 'Wed', submissions: 5 },
    { name: 'Thu', submissions: 2 }, { name: 'Fri', submissions: 7 }, { name: 'Sat', submissions: 1 }, { name: 'Sun', submissions: 6 },
  ]
};

// A simple loader component
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
      <p className="text-xl font-medium">Loading Dashboard...</p>
      <p className="text-slate-400 mt-2">Preparing your data.</p>
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(MOCK_DASHBOARD_DATA);
    };
    fetchDashboardData();
  }, []);

  if (!data) return <Loader />;

  const { user, recentTests, recentSubmissions, stats, activityData } = data;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        <DashboardHeader user={user} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Tests Completed" value={`${stats.completedTests}/${stats.totalTests}`} progress={(stats.completedTests / stats.totalTests) * 100} color="indigo" />
          <StatCard title="Average Score" value={`${stats.averageScore}%`} progress={stats.averageScore} color="green" />
          <StatCard title="Submissions" value={stats.totalSubmissions} color="purple" />
          <StatCard title="Acceptance Rate" value={`${stats.acceptanceRate}%`} progress={stats.acceptanceRate} color="teal" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2 bg-slate-800/50 rounded-xl shadow-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white flex items-center mb-4">Recent Tests</h2>
            <div className="space-y-4">
              {recentTests.map((test) => <RecentTestItem key={test.testId} test={test} />)}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white flex items-center mb-4">Recent Submissions</h2>
            <div className="space-y-4">
              {recentSubmissions.map((sub) => <SubmissionItem key={sub.submissionId} submission={sub} />)}
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <ActivityChart data={activityData} />
      </div>
    </div>
  );
};

export default Dashboard;
