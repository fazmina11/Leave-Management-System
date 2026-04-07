import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

<<<<<<< HEAD
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading, isAuthenticated } = useAuth();

  // Loading state — centered spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed → redirect to unauthorized
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized → render children
  return children;
};

export default ProtectedRoute;
=======
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return children;
}
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
