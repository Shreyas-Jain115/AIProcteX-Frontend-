import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,  
  Bar         
} from 'recharts';

import { FaChartLine } from 'react-icons/fa';

const ActivityChart = ({ data }) => (
  <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 border border-slate-700">
    <h2 className="text-xl font-semibold text-white flex items-center mb-4"><FaChartLine className="mr-2 text-indigo-400" />Candidate Activity</h2>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
          <Bar dataKey="evaluated" fill="#818cf8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
export default ActivityChart;