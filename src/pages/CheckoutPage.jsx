import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { MessageCircle, CheckCircle2, Loader } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('review'); // review, whatsapp, confirmation

  const subtotal = getCartTotal() || 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = (subtotal + shipping) * 0.08;
  const total = subtotal + shipping + tax;

  const whatsappNumber = '51974206791'; // Peru number format

  // Build WhatsApp message
  const buildWhatsAppMessage = () => {
    let message = `🛍️ *NEW ORDER FROM SOCKS OFICIAL*\n\n`;
    message += `👤 *Customer Information*\n`;
    message += `Name: ${user?.full_name || 'N/A'}\n`;
    message += `Email: ${user?.email || 'N/A'}\n\n`;
    
    message += `📦 *Products*\n`;
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Color: ${item.color || 'N/A'} | Size: ${item.size || 'N/A'}\n`;
      message += `   Quantity: ${item.quantity} x ${formatPrice(item.sale_price || item.price)}\n`;
      message += `   Subtotal: ${formatPrice((item.sale_price || item.price) * item.quantity)}\n\n`;
    });

    message += `💰 *Order Total*\n`;
    message += `Subtotal: ${formatPrice(subtotal)}\n`;
    message += `Shipping: ${shipping === 0 ? 'Free' : formatPrice(shipping)}\n`;
    message += `Tax: ${formatPrice(tax)}\n`;
    message += `*TOTAL: ${formatPrice(total)}*\n\n`;
    
    message += `Please confirm this order. Thank you!`;
    
    return encodeURIComponent(message);
  };

  const handleSendToWhatsApp = async () => {
    setLoading(true);
    try {
      // Validate user
      if (!user) {
        toast({ 
          title: 'Error', 
          description: 'User information not found. Please login again.', 
          variant: 'destructive' 
        });
        setLoading(false);
        navigate('/login?redirect=/checkout');
        return;
      }

      if (!user.id) {
        console.warn('User object:', user);
        throw new Error('User ID is missing. Please try logging in again.');
      }

      // Validate cart items
      if (!cartItems || cartItems.length === 0) {
        toast({ 
          title: 'Error', 
          description: 'Your cart is empty.', 
          variant: 'destructive' 
        });
        setLoading(false);
        return;
      }

      // Create order in database
      const orderData = {
        total_amount: total,
        items: cartItems,
        status: 'pending',
        payment_method: 'whatsapp',
        shipping_address: { 
          city: 'Order via WhatsApp',
          country: 'PE'
        },
        subtotal: subtotal,
        shipping: shipping,
        tax: tax
      };

      console.log('Creating order with:', { userId: user.id, orderData });
      const order = await api.createOrder(user.id, orderData);
      console.log('Order created successfully:', order);
      
      // Build and open WhatsApp
      const whatsappMessage = buildWhatsAppMessage();
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
      
      // Save order reference
      localStorage.setItem('pendingOrder', JSON.stringify({
        orderId: order.id,
        timestamp: new Date().toISOString()
      }));
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Show confirmation step
      setStep('confirmation');
      toast({ 
        title: '¡Excelente!', 
        description: 'Order sent to WhatsApp successfully.' 
      });
      
    } catch (error) {
      console.error('Detailed error in handleSendToWhatsApp:', error);
      toast({ 
        title: 'Error', 
        description: error?.message || 'Failed to process order. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      clearCart();
      navigate('/');
      toast({ 
        title: 'Success!', 
        description: 'Thank you for your order.' 
      });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Something went wrong.', 
        variant: 'destructive' 
      });
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
        <title>Checkout - SOCKS OFICIAL</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-12 bg-white text-black">
        
        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12 flex-wrap">
          <div className={`flex items-center gap-2 ${step === 'review' ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-black text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="font-semibold text-sm md:text-base">Review</span>
          </div>
          <div className="w-8 md:w-12 h-1 bg-gray-200"></div>
          <div className={`flex items-center gap-2 ${step === 'whatsapp' ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'whatsapp' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="font-semibold text-sm md:text-base">WhatsApp</span>
          </div>
          <div className="w-8 md:w-12 h-1 bg-gray-200"></div>
          <div className={`flex items-center gap-2 ${step === 'confirmation' ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'confirmation' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="font-semibold text-sm md:text-base">Done</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {step === 'review' && (
              <div>
                <h1 className="text-2xl font-bold mb-6 text-black">Review Your Order</h1>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800">
                    ℹ️ No credit card needed! We'll send your order to WhatsApp.
                  </p>
                </div>
                
                {/* Customer Info */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                  <h2 className="text-lg font-bold mb-4 text-black">Customer Information</h2>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Name:</strong> {user?.full_name || 'N/A'}</p>
                    <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 text-black">Items</h2>
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-black">{item.name}</p>
                          <p className="text-sm text-gray-600">Color: {item.color || 'N/A'} | Size: {item.size || 'N/A'}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-black">{formatPrice((item.sale_price || item.price) * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => setStep('whatsapp')}
                  className="w-full mt-6 h-12 text-lg bg-black hover:bg-gray-800 text-white"
                >
                  SEND TO WHATSAPP
                </Button>
              </div>
            )}

            {step === 'whatsapp' && (
              <div className="text-center py-12">
                <MessageCircle className="w-24 h-24 mx-auto mb-6 text-green-500" />
                <h1 className="text-2xl font-bold mb-4 text-black">Send Order via WhatsApp</h1>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Click the button to send your order to WhatsApp. We'll contact you to confirm.
                </p>
                
                <Button 
                  onClick={handleSendToWhatsApp}
                  disabled={loading}
                  className="w-full h-12 text-lg bg-green-500 hover:bg-green-600 text-white mb-3"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 w-5 h-5 animate-spin" />
                      SENDING...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="mr-2 w-5 h-5" />
                      SEND VIA WHATSAPP
                    </>
                  )}
                </Button>

                <Button 
                  onClick={() => setStep('review')}
                  variant="outline"
                  className="w-full h-12 text-lg border-gray-300"
                  disabled={loading}
                >
                  GO BACK
                </Button>
              </div>
            )}

            {step === 'confirmation' && (
              <div className="text-center py-12">
                <CheckCircle2 className="w-24 h-24 mx-auto mb-6 text-green-500" />
                <h1 className="text-2xl font-bold mb-4 text-black">Order Sent!</h1>
                <p className="text-gray-600 mb-2 max-w-md mx-auto">
                  Your order has been sent to WhatsApp.
                </p>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We'll contact you shortly to confirm. Thank you!
                </p>
                
                <Button 
                  onClick={handleConfirmOrder}
                  className="w-full h-12 text-lg bg-black hover:bg-gray-800 text-white"
                  disabled={loading}
                >
                  {loading ? 'PROCESSING...' : 'RETURN TO HOME'}
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-50 p-6 rounded-xl sticky top-24 border border-gray-200">
              <h2 className="text-lg font-bold mb-4 text-black">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-white rounded overflow-hidden border border-gray-200 flex-shrink-0">
                      <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-black truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm text-black whitespace-nowrap">{formatPrice((item.sale_price || item.price) * item.quantity)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
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