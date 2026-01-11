import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment process
    toast({ title: 'Processing Payment', description: 'Communicating with Stripe (Mock mode)...' });

    try {
        const orderData = {
            total_amount: total,
            items: cartItems,
            status: 'paid',
            payment_method: 'stripe_mock',
            shipping_address: { city: 'Demo City' } // simplified for demo
        };

        const order = await api.createOrder(user.id, orderData);
        clearCart();
        navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
        toast({ title: 'Error', description: 'Payment failed. Please try again.', variant: 'destructive' });
    } finally {
        setLoading(false);
    }
  };

  if (cartItems.length === 0) {
      navigate('/cart');
      return null;
  }

    return (
    <>
            <Helmet>
                <title>Pagar - SOCKS OFICIAL</title>
            </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-12 bg-white text-black">
        <div className="grid lg:grid-cols-2 gap-12">
            {/* Form Section */}
            <div>
                    <h1 className="text-2xl font-bold mb-6 text-black">Pago seguro</h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Shipping */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Truck className="text-black" />
                            <h2 className="text-lg font-bold text-black">Dirección de envío</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input required placeholder="First Name" className="p-3 border border-gray-300 rounded-lg w-full text-black bg-white focus:outline-none focus:border-black" defaultValue={user?.full_name?.split(' ')[0]} />
                            <input required placeholder="Last Name" className="p-3 border border-gray-300 rounded-lg w-full text-black bg-white focus:outline-none focus:border-black" defaultValue={user?.full_name?.split(' ')[1]} />
                            <input required placeholder="Address" className="p-3 border border-gray-300 rounded-lg w-full col-span-2 text-black bg-white focus:outline-none focus:border-black" />
                            <input required placeholder="City" className="p-3 border border-gray-300 rounded-lg w-full text-black bg-white focus:outline-none focus:border-black" />
                            <input required placeholder="ZIP Code" className="p-3 border border-gray-300 rounded-lg w-full text-black bg-white focus:outline-none focus:border-black" />
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="text-black" />
                            <h2 className="text-lg font-bold text-black">Detalles de pago</h2>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg mb-4 text-sm text-gray-500 border border-dashed border-gray-300">
                            <ShieldCheck className="inline w-4 h-4 mr-1" />
                            Modo de prueba de Stripe activo. No se realizarán cargos reales.
                        </div>
                        <div className="space-y-4">
                            <input required placeholder="Card Number" className="p-3 border border-gray-300 rounded-lg w-full text-black bg-white focus:outline-none focus:border-black" defaultValue="4242 4242 4242 4242" />
                            <div className="grid grid-cols-2 gap-4">
                                <input required placeholder="MM/YY" className="p-3 border border-gray-300 rounded-lg w-full text-black bg-white focus:outline-none focus:border-black" defaultValue="12/28" />
                                <input required placeholder="CVC" className="p-3 border border-gray-300 rounded-lg w-full text-black bg-white focus:outline-none focus:border-black" defaultValue="123" />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-14 text-lg bg-black hover:bg-gray-800 text-white">
                        {loading ? 'Procesando...' : `Pagar ${formatPrice(total)}`}
                    </Button>
                </form>
            </div>

            {/* Summary Section */}
            <div>
                <div className="bg-gray-50 p-6 rounded-xl sticky top-24 border border-gray-200">
                    <h2 className="text-lg font-bold mb-4 text-black">Resumen del pedido</h2>
                    <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="w-16 h-16 bg-white rounded-md overflow-hidden border border-gray-200">
                                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-black">{item.name}</p>
                                        <p className="text-xs text-gray-500">Cant: {item.quantity}</p>
                                </div>
                                    <p className="font-medium text-sm text-black">{formatPrice(((item.sale_price || item.price) * item.quantity))}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                         <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                        </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Envío</span>
                                <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Impuesto</span>
                                <span>{formatPrice(tax)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 text-black">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;