import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Custom hook so components can just do: const { user, login, logout } = useAuth();
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

const STORAGE_KEY = 'auth';

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app start, try to restore session from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Basic sanity check
        if (parsed?.token && parsed?.user?.userId) {
          setAuth(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to restore auth from localStorage', e);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Called after a successful login/register
  const login = (authResponse) => {
    // authResponse looks like: { token, userId, email, fullName, role }
    const payload = {
      token: authResponse.token,
      user: {
        userId: authResponse.userId,
        email: authResponse.email,
        fullName: authResponse.fullName,
        role: authResponse.role,
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setAuth(payload);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  const value = {
    // Convenience getters
    user: auth?.user || null,
    token: auth?.token || null,
    isAuthenticated: !!auth,
    isAdmin: auth?.user?.role === 'ADMIN',
    loading,
    // Actions
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};