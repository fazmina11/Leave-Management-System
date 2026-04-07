import { createContext, useContext, useState, useEffect } from 'react';

// ── Context ────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ───────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('campusleave_user');
      const storedRole = localStorage.getItem('campusleave_role');
      const storedToken = localStorage.getItem('campusleave_token');

      if (storedUser && storedRole && storedToken) {
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
        setToken(storedToken);
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
      localStorage.removeItem('campusleave_user');
      localStorage.removeItem('campusleave_role');
      localStorage.removeItem('campusleave_token');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login — persist to state + localStorage
  const login = (userData, userRole, userToken) => {
    setUser(userData);
    setRole(userRole);
    setToken(userToken);

    localStorage.setItem('campusleave_user', JSON.stringify(userData));
    localStorage.setItem('campusleave_role', userRole);
    localStorage.setItem('campusleave_token', userToken);
  };

  // Logout — clear state + localStorage
  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);

    localStorage.removeItem('campusleave_user');
    localStorage.removeItem('campusleave_role');
    localStorage.removeItem('campusleave_token');
  };

  const value = {
    user,
    role,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Custom Hook ────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
