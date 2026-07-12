import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token) => {
    localStorage.setItem('dealership_token', token);
    const claims = parseJwt(token);
    if (claims) {
      const claimRole = claims.role || claims.roles?.[0] || '';
      const isAdmin = claimRole === 'ADMIN' || claimRole === 'ROLE_ADMIN' || (claims.roles || []).includes('ROLE_ADMIN');
      setUser({
        email: claims.sub,
        role: claimRole,
        isAdmin: isAdmin,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('dealership_token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('dealership_token');
    if (token) {
      const claims = parseJwt(token);
      if (claims && claims.exp * 1000 > Date.now()) {
        const claimRole = claims.role || claims.roles?.[0] || '';
        const isAdmin = claimRole === 'ADMIN' || claimRole === 'ROLE_ADMIN' || (claims.roles || []).includes('ROLE_ADMIN');
        setUser({
          email: claims.sub,
          role: claimRole,
          isAdmin: isAdmin,
        });
      } else {
        localStorage.removeItem('dealership_token');
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
