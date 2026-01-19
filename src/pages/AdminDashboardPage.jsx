import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const products = await api.getProducts();
      const orders = await api.getOrders();

      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Productos',
      value: stats.totalProducts,
      icon: '👕',
      color: 'from-blue-600 to-blue-700',
      link: '/admin/products'
    },
    {
      title: 'Total de Pedidos',
      value: stats.totalOrders,
      icon: '📦',
      color: 'from-purple-600 to-purple-700',
      link: '/admin/orders'
    },
    {
      title: 'Ingresos Totales',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: '💰',
      color: 'from-green-600 to-green-700',
      link: '/admin/orders'
    },
    {
      title: 'Pedidos Pendientes',
      value: stats.pendingOrders,
      icon: '⏳',
      color: 'from-red-600 to-red-700',
      link: '/admin/orders',
      highlight: stats.pendingOrders > 0
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">¡Bienvenido al Panel Admin!</h1>
        <p className="text-blue-100">Gestiona tu tienda de calcetines desde aquí</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <a
            key={idx}
            href={card.link}
            className={`bg-gradient-to-br ${card.color} rounded-lg p-6 text-white hover:shadow-lg transition transform hover:scale-105 cursor-pointer ${
              card.highlight ? 'ring-2 ring-yellow-400' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-blue-100 text-sm opacity-90">{card.title}</p>
                <p className="text-4xl font-bold mt-2">{card.value}</p>
              </div>
              <span className="text-5xl">{card.icon}</span>
            </div>
            <div className="text-xs opacity-75">
              Haz clic para gestionar →
            </div>
          </a>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Links */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <a
              href="/admin/products"
              className="block p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-white font-semibold"
            >
              ➕ Agregar Nuevo Producto
            </a>
            <a
              href="/admin/orders"
              className="block p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-white font-semibold"
            >
              📋 Ver Todos los Pedidos
            </a>
            <a
              href="/admin/products"
              className="block p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-white font-semibold"
            >
              ✏️ Editar Productos
            </a>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">💡 Consejos</h2>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li className="flex gap-2">
              <span>✓</span>
              <span>Revisa regularmente los pedidos pendientes</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Mantén las imágenes de productos actualizadas</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Actualiza los precios cuando haya cambios</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Confirma los pedidos de forma rápida</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
        <h2 className="text-xl font-bold text-white mb-2">¿Necesitas Ayuda?</h2>
        <p className="text-slate-400 mb-4">
          Si tienes preguntas o problemas, contacta al equipo de soporte
        </p>
        <a
          href="mailto:support@socks.com"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition inline-block"
        >
          Contactar Soporte
        </a>
      </div>
    </div>
  );
}
