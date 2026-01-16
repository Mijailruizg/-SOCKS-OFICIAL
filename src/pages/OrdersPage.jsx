import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Calendar } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
        if (user) {
            const data = await api.getOrders(user.id);
            setOrders(data);
        }
        setLoading(false);
    };
    fetchOrders();
  }, [user]);

    if (loading) return <div className="p-12 text-center text-black">Loading orders...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-white min-h-screen">
    <h1 className="text-3xl font-bold mb-8 text-black">Order History</h1>
      
      {orders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500">No orders found yet.</p>
          </div>
      ) : (
          <div className="space-y-6">
              {orders.map(order => (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                          <div className="flex gap-6 text-sm">
                              <div>
                                  <span className="block text-gray-500">Order Placed</span>
                                  <span className="font-medium text-black">{new Date(order.created_at).toLocaleDateString()}</span>
                              </div>
                              <div>
                                      <span className="block text-gray-500">Total</span>
                                      <span className="font-medium text-black">{formatPrice(Number(order.total_amount))}</span>
                              </div>
                          </div>
                          <div className="text-sm text-gray-500">Order # {order.id.slice(0,8)}</div>
                      </div>
                      
                      <div className="p-6">
                          <div className="flex items-center gap-2 mb-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 ${
                                  order.status === 'delivered' ? 'bg-black text-white' : 'bg-white text-black'
                              }`}>
                                  {order.status.toUpperCase()}
                              </span>
                          </div>
                          
                          <div className="space-y-3">
                              {order.items?.map((item, idx) => (
                                  <div key={idx} className="flex gap-4 items-center">
                                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                                          <img src={item.image_url} className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                          <p className="font-medium text-sm text-black">{item.name}</p>
                                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default OrdersPage;