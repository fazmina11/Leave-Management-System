import { useState } from 'react';
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-px h-6 bg-gray-200"></div>
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-800 leading-none">{user?.name}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {open && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <User className="w-4 h-4" /> My Profile
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}