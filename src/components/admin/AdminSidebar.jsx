import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaBuilding, FaClipboardList, FaCog, FaSignOutAlt, FaChartArea } from 'react-icons/fa';

const AdminSidebar = () => {
const navItems = [
  { name: 'Overview', path: '/admin', icon: <FaHome /> },
  { name: 'User Management', path: '/admin/users', icon: <FaUsers /> },
  { name: 'Company Profiles', path: '/admin/companies', icon: <FaBuilding /> },
  { name: 'Test Management', path: '/admin/tests', icon: <FaClipboardList /> },
  { name: 'Platform Analytics', path: '/admin/analytics', icon: <FaChartArea /> },
];

const bottomNavItems = [
  { name: 'System Settings', path: '/admin/settings', icon: <FaCog /> },
  { name: 'Logout', path: '/logout', icon: <FaSignOutAlt /> },
];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-700/50">
      <div className="flex-shrink-0 p-6 border-b border-slate-700/50">
        <h2 className="text-xl font-semibold text-center text-slate-300">Admin Control</h2>
      </div>
      <nav className="flex-grow flex flex-col justify-between p-4">
        <div className="space-y-2">
          {navItems.map(({ name, path, icon }) => (
            <NavLink
              to={path}
              key={name}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
              end
            >
              <span className="text-lg">{icon}</span>
              <span>{name}</span>
            </NavLink>
          ))}
        </div>
        <div className="space-y-2">
          <hr className="border-t border-slate-700/50 my-2" />
          {bottomNavItems.map(({ name, path, icon }) => (
            <NavLink
              to={path}
              key={name}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              <span>{name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
