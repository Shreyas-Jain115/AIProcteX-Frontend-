
// src/components/ActivityChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaChartLine } from 'react-icons/fa';

const ActivityChart = ({ data }) => (
  <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 border border-slate-700">
    <h2 className="text-xl font-semibold text-white flex items-center mb-4"><FaChartLine className="mr-2 text-indigo-400" />Weekly Activity</h2>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#cbd5e1' }} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}/>
          <Line type="monotone" dataKey="submissions" stroke="#818cf8" strokeWidth={2} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ActivityChart;