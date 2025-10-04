// Reusable Components
const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-slate-800/50 p-5 rounded-xl border border-slate-700 hover:border-${color}-500/50 transition-all duration-300 shadow-lg`}>
    <div className="flex justify-between items-center">
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-400`}>{icon}</div>
    </div>
    <p className="text-slate-400 text-sm font-medium mt-2">{title}</p>
  </div>
);
export default StatCard;    