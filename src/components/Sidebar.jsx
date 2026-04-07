import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  PlusCircle,
  Clock,
  BarChart2,
  CheckCircle,
  Users,
  List,
  Building2,
  LogOut,
} from 'lucide-react';

// ── Navigation configs per role ────────────────────────
const navMap = {
  student: [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/apply', icon: PlusCircle, label: 'Apply Leave' },
    { to: '/student/history', icon: Clock, label: 'Leave History' },
    { to: '/student/attendance', icon: BarChart2, label: 'Attendance' },
  ],
  advisor: [
    { to: '/advisor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/advisor/reviews', icon: CheckCircle, label: 'Review Requests' },
    { to: '/advisor/students', icon: Users, label: 'My Students' },
  ],
  hod: [
    { to: '/hod/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/hod/requests', icon: List, label: 'All Requests' },
    { to: '/hod/departments', icon: Building2, label: 'Departments' },
  ],
};

const roleLabel = {
  student: 'STUDENT',
  advisor: 'ADVISOR',
  hod: 'HOD',
};

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = navMap[role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50" style={{ backgroundColor: '#1e1b4b' }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-lg font-light">
            Campus<span className="font-bold">Leave</span>
          </span>
        </div>
        <span
          className="text-xs font-medium tracking-widest px-3 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#a5b4fc' }}
        >
          {roleLabel[role] || 'USER'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom user */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs truncate" style={{ color: '#9ca3af' }}>{user?.email || ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex-shrink-0 p-1 rounded-lg transition-colors hover:text-red-400"
            style={{ color: '#9ca3af' }}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}