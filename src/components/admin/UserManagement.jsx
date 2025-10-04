// src/pages/admin/UserManagement.jsx
import React, { useState, useMemo } from 'react';
import { FaSearch, FaUserShield, FaUserGraduate, FaBuilding, FaPlus } from 'react-icons/fa';

// Mock Data for Users (replace with an API call)
const MOCK_USERS = [
  { id: 1, username: 'Jane Doe', email: 'jane.d@example.com', role: 'student', created_at: '2024-07-20T10:00:00Z' },
  { id: 2, username: 'Tech Innovations', email: 'contact@techinnovations.com', role: 'company', created_at: '2024-07-19T11:30:00Z' },
  { id: 3, username: 'Admin User', email: 'admin@eduportal.com', role: 'admin', created_at: '2024-01-15T09:00:00Z' },
  { id: 4, username: 'Bob Williams', email: 'bob.w@example.com', role: 'student', created_at: '2024-07-18T14:20:00Z' },
  { id: 5, username: 'CodeWorks', email: 'hr@codeworks.dev', role: 'company', created_at: '2024-07-17T18:00:00Z' },
  { id: 6, username: 'Alice Johnson', email: 'alice.j@example.com', role: 'student', created_at: '2024-07-16T12:00:00Z' },
];

const getRoleConfig = (role) => {
  switch (role) {
    case 'admin': return { icon: <FaUserShield />, color: 'bg-rose-500/10 text-rose-400' };
    case 'student': return { icon: <FaUserGraduate />, color: 'bg-teal-500/10 text-teal-400' };
    case 'company': return { icon: <FaBuilding />, color: 'bg-purple-500/10 text-purple-400' };
    default: return { icon: <FaUserGraduate />, color: 'bg-slate-500/10 text-slate-400' };
  }
};

const UserManagement = () => {
  const [users] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = useMemo(() => {
    return users
      .filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(u => roleFilter === 'all' || u.role === roleFilter);
  }, [users, searchTerm, roleFilter]);

  return (
    <div>
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-slate-400">View, search, and manage all users on the platform.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 flex items-center shadow-lg mt-4 md:mt-0">
          <FaPlus className="mr-2 text-xs" />
          <span>Add New User</span>
        </button>
      </header>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 px-4 pl-10 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full md:w-auto py-2 px-4 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="company">Company</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700 overflow-x-auto">
        <div className="min-w-full divide-y divide-slate-700/50">
          {/* Table Header */}
          <div className="p-4 hidden md:grid grid-cols-4 gap-4 font-semibold text-slate-400 text-sm">
            <h3>User / Company</h3>
            <h3>Email</h3>
            <h3 className="text-center">Role</h3>
            <h3 className="text-center">Actions</h3>
          </div>
          {filteredUsers.map(user => {
            const role = getRoleConfig(user.role);
            return (
              <div key={user.id} className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center hover:bg-slate-800 transition-colors duration-200">
                <div className="font-semibold text-white">{user.username}</div>
                <div className="text-sm text-slate-300">{user.email}</div>
                <div className="flex justify-center">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize flex items-center gap-2 ${role.color}`}>
                    {role.icon} {user.role}
                  </span>
                </div>
                <div className="flex justify-center gap-2">
                    <button className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold">Edit</button>
                    <button className="text-sm text-red-400 hover:text-red-300 font-semibold">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
