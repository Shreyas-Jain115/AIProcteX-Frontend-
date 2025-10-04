import {
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaCode,
  FaBuilding,
  FaUsers,
  FaClipboardList
} from 'react-icons/fa';
import { BsFillLightningFill } from 'react-icons/bs';

const RecentActivity = ({ activities }) => (
    <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
            {activities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3">
                    <div className="p-2 bg-slate-700 rounded-full mt-1">
                        {activity.type === 'New Company' ? <FaBuilding className="text-purple-400"/> : 
                         activity.type === 'New Student' ? <FaUsers className="text-teal-400"/> :
                         <FaClipboardList className="text-blue-400"/>}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-200">{activity.description}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
export default RecentActivity;