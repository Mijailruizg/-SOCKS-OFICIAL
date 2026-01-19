import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los pedidos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: 'Éxito',
        description: `Pedido actualizado a: ${getStatusLabel(newStatus)}`
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el pedido',
        variant: 'destructive'
      });
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmado',
      'processing': 'En Proceso',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-600 text-yellow-100',
      'confirmed': 'bg-blue-600 text-blue-100',
      'processing': 'bg-purple-600 text-purple-100',
      'shipped': 'bg-indigo-600 text-indigo-100',
      'delivered': 'bg-green-600 text-green-100',
      'cancelled': 'bg-red-600 text-red-100'
    };
    return colors[status] || 'bg-slate-600 text-slate-100';
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total de Pedidos', value: orders.length, icon: '📦' },
          { label: 'Pendientes', value: orders.filter(o => o.status === 'pending').length, icon: '⏳' },
          { label: 'Confirmados', value: orders.filter(o => o.status === 'confirmed').length, icon: '✅' },
          { label: 'Entregados', value: orders.filter(o => o.status === 'delivered').length, icon: '🚚' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterStatus === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Todos ({orders.length})
        </button>
        {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {getStatusLabel(status)} ({orders.filter(o => o.status === status).length})
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
            <p className="text-slate-400">No hay pedidos con este estado</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              {/* Order Header */}
              <button
                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/50 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-white">Pedido #{order.id.slice(0, 8)}</span>
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400 space-y-1">
                      <p>👤 Usuario: <span className="text-slate-200">{order.user_name || 'No especificado'}</span></p>
                      <p>✉️ Correo: <span className="text-slate-200">{order.user_email || 'No especificado'}</span></p>
                      <p>📅 Fecha: {new Date(order.created_at).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">
                      ${order.total_amount?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>

                {/* Expand Icon */}
                <span className={`ml-4 transition ${expandedOrderId === order.id ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Order Details */}
              {expandedOrderId === order.id && (
                <div className="bg-slate-700/50 border-t border-slate-600 p-6 space-y-4">
                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-white mb-3">Productos</h4>
                      <div className="space-y-2 bg-slate-800 rounded p-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <div>
                              <p className="text-white font-medium">{item.name || item.product_name}</p>
                              <p className="text-slate-400">Cantidad: {item.quantity}</p>
                            </div>
                            <p className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Shipping Address */}
                  {order.shipping_address && (
                    <div>
                      <h4 className="font-semibold text-white mb-3">Dirección de Envío</h4>
                      <div className="bg-slate-800 rounded p-4 text-sm text-slate-300">
                        <p>{order.shipping_address.full_name}</p>
                        <p>{order.shipping_address.address}</p>
                        <p>{order.shipping_address.city}, {order.shipping_address.zip_code}</p>
                        <p>{order.shipping_address.country}</p>
                        <p>Tel: {order.shipping_address.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Status Change */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Cambiar Estado</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(order.id, status)}
                          disabled={order.status === status}
                          className={`px-3 py-2 rounded text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                            order.status === status
                              ? 'bg-slate-600 text-slate-300'
                              : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                          }`}
                        >
                          {getStatusLabel(status)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="text-xs text-slate-400 pt-4 border-t border-slate-600">
                    <p>ID de Pago: {order.stripe_payment_id || 'N/A'}</p>
                    <p>Creado: {new Date(order.created_at).toLocaleString('es-ES')}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
