// // src/pages/student/MyTests.jsx
// import React, { useState, useMemo } from 'react';
// import { FaExternalLinkAlt } from 'react-icons/fa';
// import { Link } from 'react-router-dom'; // Import Link
// import { FaSearch, FaClock, FaCheckCircle, FaHourglassStart, FaEye } from 'react-icons/fa';

// // Mock Data for Student's Tests (replace with an API call)
// const MOCK_MY_TESTS = [
//   { test_id: 101, test_name: 'Frontend Developer Assessment', company_name: 'Tech Innovations Inc.', status: 'Completed', score: 92, total_score: 100 },
//   { test_id: 102, test_name: 'Data Structures Challenge', company_name: 'CodeWorks Solutions', status: 'Started', score: null, total_score: 80 },
//   { test_id: 103, test_name: 'Algorithm Mastery Test', company_name: 'Binary Brains LLC', status: 'Pending', score: null, total_score: 100, deadline: '2024-08-15' },
//   { test_id: 104, test_name: 'Java Fundamentals Quiz', company_name: 'Java Experts', status: 'Completed', score: 78, total_score: 100 },
//   { test_id: 105, test_name: 'Advanced SQL Test', company_name: 'DataDriven Co.', status: 'Pending', score: null, total_score: 100, deadline: '2024-08-20' },
// ];

// const getStatusConfig = (status) => {
//   switch (status) {
//     case 'Completed': return { icon: <FaCheckCircle />, color: 'bg-blue-500/10 text-blue-400' };
//     case 'Started': return { icon: <FaHourglassStart />, color: 'bg-yellow-500/10 text-yellow-400' };
//     case 'Pending': return { icon: <FaClock />, color: 'bg-green-500/10 text-green-400' };
//     default: return { icon: <FaClock />, color: 'bg-slate-500/10 text-slate-400' };
//   }
// };

// const MyTests = () => {
//   const [tests] = useState(MOCK_MY_TESTS);
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredTests = useMemo(() => {
//     return tests.filter(t =>
//       t.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       t.company_name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [tests, searchTerm]);

//   return (
//     <div>
//       <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-white">My Tests</h1>
//           <p className="text-slate-400">Here are all the tests assigned to you.</p>
//         </div>
//       </header>

//       <div className="mb-6">
//         <div className="relative w-full md:max-w-xs">
//           <input
//             type="text"
//             placeholder="Search by test or company..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full py-2 px-4 pl-10 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
//         </div>
//       </div>

//       <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700">
//         <div className="divide-y divide-slate-700/50">
//           {filteredTests.map(test => {
//             const status = getStatusConfig(test.status);
//             return (
//               // Wrap each item in a Link component
//               <Link to={`/student/tests/${test.test_id}`} key={test.test_id} className="p-4 block hover:bg-slate-800 transition-colors duration-200 group">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
//                   <div>
//                     <h3 className="font-semibold text-white">{test.test_name}</h3>
//                     <p className="text-sm text-slate-400">{test.company_name}</p>
//                   </div>
//                   <div className="flex items-center gap-4 mt-3 sm:mt-0">
//                     <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize flex items-center gap-2 ${status.color}`}>
//                       {status.icon} {test.status}
//                     </span>
//                     {test.status === 'Completed' && (
//                       <div className="text-lg font-bold text-green-400">
//                         {test.score}<span className="text-sm text-slate-400">/{test.total_score}</span>
//                       </div>
//                     )}
//                     <FaEye className="text-slate-500 group-hover:text-indigo-400" />
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//         {filteredTests.length === 0 && (
//           <div className="p-8 text-center text-slate-400">
//             No tests found.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyTests;


import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { FaSearch, FaClock, FaCheckCircle, FaHourglassStart, FaEye } from 'react-icons/fa';

// Mock Data for Student's Tests (replace with an API call)
const MOCK_MY_TESTS = [
  { test_id: 101, test_name: 'Frontend Developer Assessment', company_name: 'Tech Innovations Inc.', status: 'Completed', score: 92, total_score: 100 },
  { test_id: 102, test_name: 'Data Structures Challenge', company_name: 'CodeWorks Solutions', status: 'Started', score: null, total_score: 80 },
  { test_id: 103, test_name: 'Algorithm Mastery Test', company_name: 'Binary Brains LLC', status: 'Pending', score: null, total_score: 100, deadline: '2024-08-15' },
  { test_id: 104, test_name: 'Java Fundamentals Quiz', company_name: 'Java Experts', status: 'Completed', score: 78, total_score: 100 },
  { test_id: 105, test_name: 'Advanced SQL Test', company_name: 'DataDriven Co.', status: 'Pending', score: null, total_score: 100, deadline: '2024-08-20' },
];

const getStatusConfig = (status) => {
  switch (status) {
    case 'Completed': return { icon: <FaCheckCircle />, color: 'bg-blue-500/10 text-blue-400' };
    case 'Started': return { icon: <FaHourglassStart />, color: 'bg-yellow-500/10 text-yellow-400' };
    case 'Pending': return { icon: <FaClock />, color: 'bg-green-500/10 text-green-400' };
    default: return { icon: <FaClock />, color: 'bg-slate-500/10 text-slate-400' };
  }
};

const MyTests = () => {
  const [tests] = useState(MOCK_MY_TESTS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTests = useMemo(() => {
    return tests.filter(t =>
      t.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tests, searchTerm]);

  return (
    <div>
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Tests</h1>
          <p className="text-slate-400">Here are all the tests assigned to you.</p>
        </div>
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
          {filteredTests.map(test => {
            const status = getStatusConfig(test.status);
            return (
              // Wrap each item in a Link component
              <Link to={`/student/tests/${test.test_id}`} key={test.test_id} className="p-4 block hover:bg-slate-800 transition-colors duration-200 group">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h3 className="font-semibold text-white">{test.test_name}</h3>
                    <p className="text-sm text-slate-400">{test.company_name}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-3 sm:mt-0">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize flex items-center gap-2 ${status.color}`}>
                      {status.icon} {test.status}
                    </span>
                    {test.status === 'Completed' && (
                      <div className="text-lg font-bold text-green-400">
                        {test.score}<span className="text-sm text-slate-400">/{test.total_score}</span>
                      </div>
                    )}
                    <FaEye className="text-slate-500 group-hover:text-indigo-400" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {filteredTests.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            No tests found.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTests;
