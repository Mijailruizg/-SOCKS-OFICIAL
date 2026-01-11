import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for persisted session
    const storedUser = localStorage.getItem('session_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, name) => {
    const { user, error } = await api.register(email, password, name);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { error };
    }
    
    // Auto login after register
    setUser(user);
    localStorage.setItem('session_user', JSON.stringify(user));
    toast({ title: '¡Éxito!', description: 'Cuenta creada correctamente.' });
    return { data: user, error: null };
  };

  const signIn = async (email, password) => {
    const { user, error } = await api.login(email, password);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { error };
    }
    
    setUser(user);
    localStorage.setItem('session_user', JSON.stringify(user));
    toast({ title: '¡Bienvenido de nuevo!', description: `Sesión iniciada como ${user.email}` });
    return { data: user, error: null };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('session_user');
    toast({ title: 'Sesión cerrada', description: '¡Hasta la próxima!' });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};