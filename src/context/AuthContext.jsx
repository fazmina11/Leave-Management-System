import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const login = (userData, userRole, userToken) => {
    setUser(userData);
    setRole(userRole);
    setToken(userToken);
    localStorage.setItem('cl_user', JSON.stringify(userData));
    localStorage.setItem('cl_role', userRole);
    localStorage.setItem('cl_token', userToken);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
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