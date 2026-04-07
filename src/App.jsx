<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Student pages
=======
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
import StudentDashboard from './pages/student/StudentDashboard';
import ApplyLeave from './pages/student/ApplyLeave';
import LeaveHistory from './pages/student/LeaveHistory';
import Attendance from './pages/student/Attendance';
<<<<<<< HEAD

// Advisor pages
import AdvisorDashboard from './pages/advisor/AdvisorDashboard';
import ReviewLeaves from './pages/advisor/ReviewLeaves';

// HOD pages
import HODDashboard from './pages/hod/HODDashboard';
import AllRequests from './pages/hod/AllRequests';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// ── Unauthorized Page ──────────────────────────────────
const Unauthorized = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f7fb]">
    <div className="text-center">
      <div className="text-7xl mb-4">🚫</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-sm text-gray-500 mb-6">
        You don&apos;t have permission to access this page.
      </p>
      <Link
        to="/login"
        className="inline-block bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
      >
        Go to Login
      </Link>
    </div>
  </div>
);

function App() {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Determine default redirect for authenticated users
  const getDefaultRoute = () => {
    switch (role) {
      case 'student': return '/student/dashboard';
      case 'advisor': return '/advisor/dashboard';
      case 'hod':     return '/hod/dashboard';
      default:        return '/login';
    }
  };

  return (
    <Router>
      <Routes>
        {/* ── Public Routes ──────────────────────────── */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Signup />}
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ── Student Routes ─────────────────────────── */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/apply"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ApplyLeave />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/history"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <LeaveHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Attendance />
            </ProtectedRoute>
          }
        />

        {/* ── Advisor Routes ─────────────────────────── */}
        <Route
          path="/advisor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['advisor']}>
              <AdvisorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advisor/reviews"
          element={
            <ProtectedRoute allowedRoles={['advisor']}>
              <ReviewLeaves />
            </ProtectedRoute>
          }
        />

        {/* ── HOD Routes ─────────────────────────────── */}
        <Route
          path="/hod/dashboard"
          element={
            <ProtectedRoute allowedRoles={['hod']}>
              <HODDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hod/requests"
          element={
            <ProtectedRoute allowedRoles={['hod']}>
              <AllRequests />
            </ProtectedRoute>
          }
        />

        {/* ── Root Redirect ──────────────────────────── */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? getDefaultRoute() : '/login'} replace />}
        />

        {/* ── Catch-all ──────────────────────────────── */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? getDefaultRoute() : '/login'} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
=======
import AdvisorDashboard from './pages/advisor/AdvisorDashboard';
import ReviewLeaves from './pages/advisor/ReviewLeaves';
import HODDashboard from './pages/hod/HODDashboard';
import AllRequests from './pages/hod/AllRequests';

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-6xl mb-4">🚫</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">You don't have permission to view this page.</p>
        <a href="/login" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Go to Login</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/apply" element={<ProtectedRoute allowedRoles={['student']}><ApplyLeave /></ProtectedRoute>} />
          <Route path="/student/history" element={<ProtectedRoute allowedRoles={['student']}><LeaveHistory /></ProtectedRoute>} />
          <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={['student']}><Attendance /></ProtectedRoute>} />

          <Route path="/advisor/dashboard" element={<ProtectedRoute allowedRoles={['advisor']}><AdvisorDashboard /></ProtectedRoute>} />
          <Route path="/advisor/reviews" element={<ProtectedRoute allowedRoles={['advisor']}><ReviewLeaves /></ProtectedRoute>} />

          <Route path="/hod/dashboard" element={<ProtectedRoute allowedRoles={['hod']}><HODDashboard /></ProtectedRoute>} />
          <Route path="/hod/requests" element={<ProtectedRoute allowedRoles={['hod']}><AllRequests /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
