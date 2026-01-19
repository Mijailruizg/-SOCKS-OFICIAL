import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useToast } from '@/components/ui/use-toast';

export default function AdminLayout() {
  const { admin, adminLogout } = useAdminAuth();
  const { toast } = useToast();
  const location = useLocation();

  const handleLogout = async () => {
    await adminLogout();
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión del panel de administrador'
    });
    window.location.href = '/admin/login';
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/admin/dashboard', label: 'Panel Principal', icon: '📊' },
    { path: '/admin/products', label: 'Gestionar Productos', icon: '👕' },
    { path: '/admin/orders', label: 'Gestionar Pedidos', icon: '📦' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">SOCKS Admin</h1>
          <p className="text-slate-400 text-sm mt-2">Panel de Administración</p>
        </div>

        {/* Admin Info */}
        <div className="bg-slate-700/50 rounded-lg p-4 mb-8 border border-slate-600">
          <p className="text-xs text-slate-400">Administrador</p>
          <p className="text-white font-semibold truncate">{admin?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-600/50 py-2 rounded-lg transition font-medium"
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {navItems.find((item) => isActive(item.path))?.label || 'Admin Panel'}
            </h2>
            <div className="text-slate-400 text-sm">
              {new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
