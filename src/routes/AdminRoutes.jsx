
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/CompanyDashboard';
import TestManagement from '../components/common/TestManagement';
import UserManagement from '../components/admin/UserManagement';
import CompanyProfiles from '../components/admin/CompanyProfiles';
import SystemSettings from '../components/company/SystemSettings';
import PlatformAnalytics from '../components/admin/PlatformAnalytics';
const Placeholder = ({ title }) => <div className="text-white text-2xl">{title}</div>;

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement/>} />
        <Route path="companies" element={<CompanyProfiles/>} />
        <Route path="tests" element={<TestManagement/>} />
        <Route path="analytics" element={<PlatformAnalytics />} />
        <Route path="settings" element={<SystemSettings/>} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;