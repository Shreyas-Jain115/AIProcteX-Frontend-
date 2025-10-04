// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { FaUsers, FaBuilding, FaClipboardList, FaChartLine } from 'react-icons/fa';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import StatCard from '../../components/admin/StatCard';
import UserGrowthChart from '../../components/admin/UserGrowthChart';
import RecentActivity from '../../components/admin/RecentActivity';


// Mock Data for Admin Dashboard
const MOCK_ADMIN_DATA = {
  stats: {
    totalUsers: 1250,
    totalCompanies: 48,
    totalTests: 320,
    activeSessions: 156,
  },
  userGrowth: [
    { date: 'Jan', users: 200 }, { date: 'Feb', users: 350 }, { date: 'Mar', users: 500 },
    { date: 'Apr', users: 680 }, { date: 'May', users: 900 }, { date: 'Jun', users: 1250 },
  ],
  recentActivity: [
    { id: 1, type: 'New Company', description: 'Innovate LLC just signed up.', time: '15m ago' },
    { id: 2, type: 'New Student', description: 'Alex Ray registered.', time: '45m ago' },
    { id: 3, type: 'New Test', description: 'CodeWorks created a "Go Developer" test.', time: '2h ago' },
    { id: 4, type: 'System', description: 'Database backup completed successfully.', time: '3h ago' },
  ]
};


// Main Admin Dashboard Component
const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setData(MOCK_ADMIN_DATA), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!data) return <div className="text-center p-10">Loading Admin Dashboard...</div>;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Platform Overview</h1>
        <p className="text-slate-400">A high-level view of system-wide metrics and activities.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={data.stats.totalUsers.toLocaleString()} icon={<FaUsers size={20} />} color="teal" />
        <StatCard title="Registered Companies" value={data.stats.totalCompanies} icon={<FaBuilding size={20} />} color="purple" />
        <StatCard title="Total Tests Created" value={data.stats.totalTests} icon={<FaClipboardList size={20} />} color="indigo" />
        <StatCard title="Active Sessions" value={data.stats.activeSessions} icon={<FaChartLine size={20} />} color="green" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <UserGrowthChart data={data.userGrowth} />
        </div>
        <div className="xl:col-span-1">
            <RecentActivity activities={data.recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;