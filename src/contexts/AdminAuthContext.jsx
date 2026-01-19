import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext({});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    // Check for persisted admin session
    const storedAdmin = localStorage.getItem('admin_session');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setAdminLoading(false);
  }, []);

  const adminLogin = async (email, password) => {
    try {
      // In production, validate against backend.
      // Read admin creds from environment variables when available.
      const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@socks.com';
      const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'; // Override via Vite env vars
      
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
          id: 'admin-1',
          email: email,
          role: 'admin',
          login_time: new Date().toISOString()
        };
        
        setAdmin(adminUser);
        localStorage.setItem('admin_session', JSON.stringify(adminUser));
        return { data: adminUser, error: null };
      }
      
      return { 
        data: null, 
        error: { message: 'Credenciales de administrador inválidas' } 
      };
    } catch (err) {
      return { error: err };
    }
  };

  const adminLogout = async () => {
    setAdmin(null);
    localStorage.removeItem('admin_session');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, adminLoading, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
