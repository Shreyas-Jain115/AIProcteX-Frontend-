import CompanySidebar from '../components/company/CompanySidebar';
import CompanyTopbar from '../components/company/CompanyTopbar';
import { Outlet } from 'react-router-dom';

const CompanyLayout = () => {
  return (
    <div className="flex h-screen flex-col bg-slate-900 text-white">
      <CompanyTopbar />
      <div className="flex flex-1 overflow-hidden">
        <CompanySidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;
