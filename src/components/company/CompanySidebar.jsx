
// src/components/company/CompanySidebar.jsx
import { NavLink } from 'react-router-dom';
import { FaHome, FaClipboardList, FaUsers, FaQuestionCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { RiTestTubeFill } from 'react-icons/ri';

const CompanySidebar = () => {
const navItems = [
  { name: 'Dashboard', path: '/company', icon: <FaHome /> },
  { name: 'Tests', path: '/company/tests', icon: <FaClipboardList /> },
  { name: 'Questions', path: '/company/questions', icon: <FaQuestionCircle /> },
  { name: 'Candidates', path: '/company/candidates', icon: <FaUsers /> },
  { name: 'Results', path: '/company/results', icon: <RiTestTubeFill /> },
];

const bottomNavItems = [
  { name: 'Settings', path: '/company/settings', icon: <FaCog /> },
  { name: 'Logout', path: '/logout', icon: <FaSignOutAlt /> },
];



  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-700/50">
      <div className="flex-shrink-0 p-6 border-b border-slate-700/50">
        <h2 className="text-xl font-semibold text-center text-slate-300">Company Menu</h2>
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

export default CompanySidebar;
