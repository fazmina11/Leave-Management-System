import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import StudentDashboard from './pages/student/StudentDashboard';
import ApplyLeave from './pages/student/ApplyLeave';
import LeaveHistory from './pages/student/LeaveHistory';
import Attendance from './pages/student/Attendance';
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