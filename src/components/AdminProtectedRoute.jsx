import React from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function AdminProtectedRoute({ children }) {
  const { admin, adminLoading } = useAdminAuth();

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    // Redirect to admin login
    window.location.href = '/admin/login';
    return null;
  }

  return children;
}
