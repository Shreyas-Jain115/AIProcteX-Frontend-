import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import { Outlet } from 'react-router-dom';

const StudentLayout = () => {
  return (
    // The root container is now a flex-col to stack the Topbar on top.
    <div className="flex h-screen flex-col bg-slate-900 text-white">
      
      {/* The Topbar now occupies the full width at the top. */}
      <Topbar />

      {/* This container holds the sidebar and main content side-by-side.
          It uses flex-1 to fill the remaining vertical space and overflow-hidden
          to establish a new block formatting context for the scrolling content. */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* The Sidebar component is placed here. */}
        <Sidebar />
        
        {/* The main content area scrolls independently. */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;