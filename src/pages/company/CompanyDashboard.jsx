// import React, { useState, useEffect } from 'react';
// import { FaPlus, FaClipboardList, FaUsers, FaCheckCircle, FaChartLine } from 'react-icons/fa';
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
// import StatCard from '../../components/student/StatCard';
// import RecentTestCard from '../../components/company/RecentTestCard';
// import ActivityChart from '../../components/student/ActivityChart';
// // Mock Data (replace with API calls)
// const MOCK_COMPANY_DATA = {
//   stats: {
//     activeTests: 12,
//     candidatesEvaluated: 245,
//     averageScore: 78,
//     passRate: 65,
//   },
//   recentTests: [
//     { id: 1, name: 'Senior Frontend Engineer', candidates: 45, status: 'Active' },
//     { id: 2, name: 'Backend Python Developer', candidates: 78, status: 'Active' },
//     { id: 3, name: 'Full-Stack Assessment (React/Node)', candidates: 32, status: 'Grading' },
//     { id: 4, name: 'DevOps Screening', candidates: 50, status: 'Completed' },
//   ],
//   candidateActivity: [
//     { month: 'Jan', evaluated: 25 }, { month: 'Feb', evaluated: 40 }, { month: 'Mar', evaluated: 60 },
//     { month: 'Apr', evaluated: 55 }, { month: 'May', evaluated: 75 }, { month: 'Jun', evaluated: 90 },
//   ],
// };

// // Main Dashboard Component
// const CompanyDashboard = () => {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     // Simulate API call
//     const timer = setTimeout(() => setData(MOCK_COMPANY_DATA), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   if (!data) return <div className="text-center p-10">Loading...</div>;

//   return (
//     <div>
//       <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-white">Company Dashboard</h1>
//           <p className="text-slate-400">Overview of your tests and candidates.</p>
//         </div>
//         <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 flex items-center shadow-lg mt-4 md:mt-0">
//           <FaPlus className="mr-2 text-xs" />
//           <span>Create New Test</span>
//         </button>
//       </header>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <StatCard title="Active Tests" value={data.stats.activeTests} icon={<FaClipboardList size={20} />} color="indigo" />
//         <StatCard title="Candidates Evaluated" value={data.stats.candidatesEvaluated} icon={<FaUsers size={20} />} color="purple" />
//         <StatCard title="Average Score" value={`${data.stats.averageScore}%`} icon={<FaChartLine size={20} />} color="green" />
//         <StatCard title="Overall Pass Rate" value={`${data.stats.passRate}%`} icon={<FaCheckCircle size={20} />} color="teal" />
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
//         <div className="xl:col-span-1 bg-slate-800/50 rounded-xl shadow-lg p-6 border border-slate-700">
//           <h2 className="text-xl font-semibold text-white flex items-center mb-4">Recent Tests</h2>
//           <div className="space-y-4">
//             {data.recentTests.map((test) => <RecentTestCard key={test.id} test={test} />)}
//           </div>
//         </div>
//         <div className="xl:col-span-2">
//           <ActivityChart data={data.candidateActivity} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompanyDashboard;
import React, { useState, useEffect } from 'react';
import { FaPlus, FaClipboardList, FaUsers, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import StatCard from '../../components/student/StatCard';
import RecentTestCard from '../../components/company/RecentTestCard';
import ActivityChart from '../../components/student/ActivityChart';

const MOCK_COMPANY_DATA = {
  stats: {
    activeTests: 12,
    candidatesEvaluated: 245,
    averageScore: 78,
    passRate: 65,
  },
  recentTests: [
    { id: 1, name: 'Senior Frontend Engineer', candidates: 45, status: 'Active' },
    { id: 2, name: 'Backend Python Developer', candidates: 78, status: 'Active' },
    { id: 3, name: 'Full-Stack Assessment (React/Node)', candidates: 32, status: 'Grading' },
    { id: 4, name: 'DevOps Screening', candidates: 50, status: 'Completed' },
  ],
  candidateActivity: [
    { week: 'Week 1', evaluated: 12 },
    { week: 'Week 2', evaluated: 18 },
    { week: 'Week 3', evaluated: 22 },
    { week: 'Week 4', evaluated: 15 },
    { week: 'Week 5', evaluated: 27 },
    { week: 'Week 6', evaluated: 19 },
    { week: 'Week 7', evaluated: 30 },
  ],
};

const CompanyDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setData(MOCK_COMPANY_DATA), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!data) return <div className="text-center p-10 text-white">Loading...</div>;

  return (
    <div>
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Company Dashboard</h1>
          <p className="text-slate-400">Overview of your tests and candidates.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 flex items-center shadow-lg mt-4 md:mt-0">
          <FaPlus className="mr-2 text-xs" />
          <span>Create New Test</span>
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Tests" value={data.stats.activeTests} icon={<FaClipboardList size={20} />} color="indigo" />
        <StatCard title="Candidates Evaluated" value={data.stats.candidatesEvaluated} icon={<FaUsers size={20} />} color="purple" />
        <StatCard title="Average Score" value={`${data.stats.averageScore}%`} icon={<FaChartLine size={20} />} color="green" />
        <StatCard title="Overall Pass Rate" value={`${data.stats.passRate}%`} icon={<FaCheckCircle size={20} />} color="teal" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-1 bg-slate-800/50 rounded-xl shadow-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Tests</h2>
          <div className="space-y-4">
            {data.recentTests.map((test) => (
              <RecentTestCard key={test.id} test={test} />
            ))}
          </div>
        </div>
        <div className="xl:col-span-2">
          <ActivityChart data={data.candidateActivity} />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
