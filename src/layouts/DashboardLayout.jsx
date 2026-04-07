import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

<<<<<<< HEAD
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
=======
export default function DashboardLayout({ children, title }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar title={title} />
        <main className="flex-1 p-6">
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
          {children}
        </main>
      </div>
    </div>
  );
<<<<<<< HEAD
};

export default DashboardLayout;
=======
}
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
