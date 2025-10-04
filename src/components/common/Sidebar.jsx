
import { NavLink } from 'react-router-dom';
import { FaHome, FaLaptopCode, FaChartBar, FaHistory, FaUserCircle, FaSignOutAlt, FaBookOpen } from 'react-icons/fa';

const Sidebar = () => {
const navItems = [
  { name: 'Dashboard', path: '/student', icon: <FaHome /> },
  { name: 'My Tests', path: '/student/tests', icon: <FaLaptopCode /> },
  { name: 'Upcoming Tests', path: '/student/results', icon: <FaChartBar /> },
  { name: 'Resources', path: '/student/resources', icon: <FaBookOpen /> },
  { name: 'History', path: '/student/history', icon: <FaHistory /> },
];

const bottomNavItems = [
  { name: 'Profile', path: '/student/profile', icon: <FaUserCircle /> },
  { name: 'Logout', path: '/logout', icon: <FaSignOutAlt /> },
];

  return (
    // The sidebar container is styled for a professional look.
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-700/50">
      
 

      <nav className="flex-grow flex flex-col justify-between p-4">
        {/* Main navigation links */}
        <div className="space-y-2">
          {navItems.map(({ name, path, icon }) => (
            <NavLink
              to={path}
              key={name}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
              end
            >
              <span className="text-lg">{icon}</span>
              <span>{name}</span>
            </NavLink>
          ))}
        </div>

        {/* Bottom navigation links (Profile, Logout) */}
        <div className="space-y-2">
          <hr className="border-t border-slate-700/50 my-2" />
          {bottomNavItems.map(({ name, path, icon }) => (
            <NavLink
              to={path}
              key={name}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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

export default Sidebar;