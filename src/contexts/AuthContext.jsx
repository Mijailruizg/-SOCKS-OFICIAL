import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for persisted session
    const storedUser = localStorage.getItem('session_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, name) => {
    try {
      const { user, error } = await api.register(email, password, name);
      if (error) {
        return { error };
      }
      
      // Auto login after register
      setUser(user);
      localStorage.setItem('session_user', JSON.stringify(user));
      return { data: user, error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { user, error } = await api.login(email, password);
      if (error) {
        return { error };
      }
      
      setUser(user);
      localStorage.setItem('session_user', JSON.stringify(user));
      return { data: user, error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('session_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};