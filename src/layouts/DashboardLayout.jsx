import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area — offset by sidebar width */}
      <div className="ml-64 flex flex-col min-h-screen" style={{ backgroundColor: '#f5f7fb' }}>
        {/* Sticky Navbar */}
        <Navbar title={title} />

        {/* Page Content */}
        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
