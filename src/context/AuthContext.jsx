import { createContext, useContext, useState, useEffect } from 'react';

<<<<<<< HEAD
// ── Context ────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ───────────────────────────────────────────
export const AuthProvider = ({ children }) => {
=======
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
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
=======
  useEffect(() => {
    const savedUser = localStorage.getItem('cl_user');
    const savedRole = localStorage.getItem('cl_role');
    const savedToken = localStorage.getItem('cl_token');
    if (savedUser && savedRole && savedToken) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole);
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
  const login = (userData, userRole, userToken) => {
    setUser(userData);
    setRole(userRole);
    setToken(userToken);
<<<<<<< HEAD

    localStorage.setItem('campusleave_user', JSON.stringify(userData));
    localStorage.setItem('campusleave_role', userRole);
    localStorage.setItem('campusleave_token', userToken);
  };

  // Logout — clear state + localStorage
=======
    localStorage.setItem('cl_user', JSON.stringify(userData));
    localStorage.setItem('cl_role', userRole);
    localStorage.setItem('cl_token', userToken);
  };

>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
<<<<<<< HEAD

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
=======
    localStorage.removeItem('cl_user');
    localStorage.removeItem('cl_role');
    localStorage.removeItem('cl_token');
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
>>>>>>> b1b8775c99732737e7c05f60295f603e4cfff942
