import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSearch, FaClock, FaCheckCircle, FaGraduationCap } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import CreateTest from '../company/CreateTest';
import { getTests,getUsersScoreByTestId } from '../../api/test';

// Function to determine test status and duration based on current time
const getStatusAndDuration = (startTime, endTime) => {
  const now = new Date();
  const start = startTime ? new Date(startTime) : null;
  const end = endTime ? new Date(endTime) : null;

  if (!start || !end) return { status: 'Draft', duration: 'N/A' };

  let durationText = 'N/A';
  if (end.getTime() > start.getTime()) {
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.floor(durationMs / 60000);
    durationText = `${durationMinutes} mins`;
  }

  if (now < start) return { status: 'Scheduled', duration: durationText };
  if (now >= start && now <= end) return { status: 'Active', duration: durationText };
  if (now > end) return { status: 'Completed', duration: durationText };

  return { status: 'Draft', duration: 'N/A' };
};

// Function to get UI styles based on status
const getStatusConfig = (status) => {
  switch (status) {
    case 'Active': return { icon: <FaClock />, color: 'bg-green-500/10 text-green-400' };
    case 'Scheduled': return { icon: <FaClock />, color: 'bg-purple-500/10 text-purple-400' };
    case 'Grading': return { icon: <FaGraduationCap />, color: 'bg-yellow-500/10 text-yellow-400' };
    case 'Completed': return { icon: <FaCheckCircle />, color: 'bg-blue-500/10 text-blue-400' };
    case 'Draft': return { icon: <FaPlus />, color: 'bg-slate-500/10 text-slate-400' };
    default: return { icon: <FaClock />, color: 'bg-slate-500/10 text-slate-400' };
  }
};

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getTests();
        const formattedData = data.map((test) => {
          const { status, duration } = getStatusAndDuration(test.startTime, test.endTime);
          return {
            test_id: test.testId, // use actual backend ID
            test_name: test.testName,
            status,
            duration_minutes: duration,
            created_at: test.createdAt,
          };
        });
        setTests(formattedData);
      } catch (e) {
        console.error('Error fetching tests:', e);
      }
    };

    fetchTests();
  }, []);

  const filteredTests = useMemo(() => {
    return tests
      .filter(t => t.test_name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(t => statusFilter === 'all' || t.status === statusFilter);
  }, [tests, searchTerm, statusFilter]);

  return (
    <>
      <div>
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Test Management</h1>
            <p className="text-slate-400">Create, view, and manage your company's tests.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 flex items-center shadow-lg mt-4 md:mt-0"
          >
            <FaPlus className="mr-2 text-xs" />
            <span>Create New Test</span>
          </button>
        </header>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search tests by name..."
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
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Grading">Grading</option>
            <option value="Completed">Completed</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Tests List */}
        <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700">
          <div className="divide-y divide-slate-700/50">
            {/* Table Header */}
            <div className="p-4 hidden md:grid grid-cols-4 gap-4 font-semibold text-slate-400 text-sm">
              <h3>Test Name</h3>
              <h3>Status</h3>
              <h3>Duration</h3>
              <h3>Created On</h3>
            </div>
            {filteredTests.map(test => {
              const statusConfig = getStatusConfig(test.status);
              return (
                <Link
                  key={test.test_id}
                  to={`/company/test-attempts/${test.test_id}`} // now uses correct ID
                  className="block"
                >
                  <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center hover:bg-slate-800 transition-colors duration-200">
                    <div className="col-span-2 md:col-span-1">
                      <h3 className="font-semibold text-white">{test.test_name}</h3>
                    </div>
                    <div>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize flex items-center gap-2 ${statusConfig.color}`}>
                        {statusConfig.icon} {test.status}
                      </span>
                    </div>
                    <div className="text-slate-300">{test.duration_minutes}</div>
                    <div className="text-slate-400 text-sm">
                      {test.created_at ? new Date(test.created_at).toLocaleDateString() : 'N/A'}
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

      {isModalOpen && <CreateTest onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default TestManagement;
