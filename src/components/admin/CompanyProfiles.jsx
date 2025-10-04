// src/pages/admin/CompanyProfiles.jsx
import React, { useState, useMemo } from 'react';
import { FaSearch, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

// Mock Data for Companies (replace with an API call)
const MOCK_COMPANIES = [
  { id: 1, company_name: 'Tech Innovations Inc.', email: 'contact@techinnovations.com', status: 'Active', created_at: '2024-07-29T11:30:00Z' },
  { id: 2, company_name: 'CodeWorks Solutions', email: 'hr@codeworks.dev', status: 'Active', created_at: '2024-07-25T18:00:00Z' },
  { id: 3, company_name: 'Binary Brains LLC', email: 'support@binarybrains.io', status: 'Pending', created_at: '2024-07-30T09:00:00Z' },
  { id: 4, company_name: 'DataDriven Co.', email: 'info@datadriven.co', status: 'Active', created_at: '2024-07-22T14:20:00Z' },
  { id: 5, company_name: 'Legacy Systems', email: 'accounts@legacysys.com', status: 'Suspended', created_at: '2024-06-15T10:00:00Z' },
];

const getStatusConfig = (status) => {
  switch (status) {
    case 'Active': return { icon: <FaCheckCircle />, color: 'bg-green-500/10 text-green-400' };
    case 'Pending': return { icon: <FaHourglassHalf />, color: 'bg-yellow-500/10 text-yellow-400' };
    case 'Suspended': return { icon: <FaTimesCircle />, color: 'bg-red-500/10 text-red-400' };
    default: return { icon: <FaCheckCircle />, color: 'bg-slate-500/10 text-slate-400' };
  }
};

const CompanyProfiles = () => {
  const [companies] = useState(MOCK_COMPANIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCompanies = useMemo(() => {
    return companies
      .filter(c =>
        c.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(c => statusFilter === 'all' || c.status === statusFilter);
  }, [companies, searchTerm, statusFilter]);

  return (
    <div>
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Company Profiles</h1>
          <p className="text-slate-400">View and manage all registered companies.</p>
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
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Companies Table */}
      <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700 overflow-x-auto">
        <div className="min-w-full divide-y divide-slate-700/50">
          {/* Table Header */}
          <div className="p-4 hidden md:grid grid-cols-4 gap-4 font-semibold text-slate-400 text-sm">
            <h3>Company Name</h3>
            <h3>Contact Email</h3>
            <h3 className="text-center">Status</h3>
            <h3 className="text-center">Actions</h3>
          </div>
          {filteredCompanies.map(company => {
            const status = getStatusConfig(company.status);
            return (
              <div key={company.id} className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center hover:bg-slate-800 transition-colors duration-200">
                <div className="font-semibold text-white">{company.company_name}</div>
                <div className="text-sm text-slate-300">{company.email}</div>
                <div className="flex justify-center">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize flex items-center gap-2 ${status.color}`}>
                    {status.icon} {company.status}
                  </span>
                </div>
                <div className="flex justify-center gap-2">
                    <button className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold">View</button>
                    {company.status === 'Pending' && <button className="text-sm text-green-400 hover:text-green-300 font-semibold">Approve</button>}
                    {company.status === 'Active' && <button className="text-sm text-red-400 hover:text-red-300 font-semibold">Suspend</button>}
                </div>
              </div>
            );
          })}
        </div>
        {filteredCompanies.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            No companies found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfiles;
