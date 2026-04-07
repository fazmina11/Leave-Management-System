import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  CalendarCheck,
  CheckSquare,
  Users,
  Building2,
  LogOut,
} from 'lucide-react';

// ── Navigation configs per role ────────────────────────
const navConfig = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/apply', label: 'Apply Leave', icon: FilePlus },
    { to: '/student/history', label: 'Leave History', icon: ClipboardList },
    { to: '/student/attendance', label: 'Attendance', icon: CalendarCheck },
  ],
  advisor: [
    { to: '/advisor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/advisor/reviews', label: 'Review Requests', icon: CheckSquare },
  ],
  hod: [
    { to: '/hod/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/hod/requests', label: 'All Requests', icon: ClipboardList },
  ],
};

// ── Role labels ────────────────────────────────────────
const roleLabels = {
  student: 'Student Panel',
  advisor: 'Advisor Panel',
  hod: 'HOD Panel',
};

const Sidebar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = navConfig[role] || [];
  const roleLabel = roleLabels[role] || 'Panel';

  // Get initials for avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50"
      style={{ backgroundColor: '#1e1b4b' }}
    >
      {/* ── Logo Section ──────────────────────────────── */}
      <div
        className="px-5 pt-6 pb-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white text-lg font-light">Campus</span>
            <span className="text-indigo-300 text-lg font-bold">Leave</span>
          </div>
        </div>

        {/* Role badge */}
        <div className="mt-3">
          <span
            className="text-xs font-medium tracking-widest text-indigo-200 px-3 py-1 rounded-full uppercase inline-block"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            {roleLabel}
          </span>
        </div>
      </div>

      {/* ── Navigation Section ────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium'
                : 'flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white text-sm font-medium transition-all'
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom User Section ───────────────────────── */}
      <div
        className="px-4 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>

          {/* Name & Email */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs truncate" style={{ color: '#9ca3af' }}>
              {user?.email || 'user@campus.edu'}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex-shrink-0 p-1 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut
              className="w-4 h-4 hover:text-red-400 transition-colors"
              style={{ color: '#9ca3af' }}
            />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
