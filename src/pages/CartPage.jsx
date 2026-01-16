import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) {
        navigate('/login?redirect=/checkout');
    } else {
        navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center bg-white text-black">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">Start shopping to add items to your cart.</p>
            <Link to="/shop">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
                    START SHOPPING
                </Button>
            </Link>
        </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - SOCKS OFICIAL</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-12 bg-white text-black">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartItems.length})</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-black">{item.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                        {(item.size || item.color) && (
                          <p className="text-xs text-gray-600 mt-1">
                            {item.color && `Color: ${item.color}`} {item.size && `• Size: ${item.size}`}
                          </p>
                        )}
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-black text-gray-600">
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center text-black">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-black text-gray-600">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-right">
                         <span className="font-bold text-lg text-black">{formatPrice(((item.sale_price || item.price) * item.quantity))}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
             <Button variant="ghost" onClick={clearCart} className="text-red-500 hover:text-red-600 pl-0 hover:bg-transparent">
                Vaciar carrito
             </Button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                <h2 className="text-xl font-bold mb-6 text-black">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-black">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-black">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium text-black">{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                        <span className="font-bold text-lg text-black">Total</span>
                        <span className="font-bold text-lg text-black">{formatPrice(total)}</span>
                    </div>
                </div>

                <Button onClick={handleCheckout} className="w-full h-12 text-lg bg-black hover:bg-gray-800 text-white">
                    Pay <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <p className="text-xs text-center text-gray-500 mt-4">
                    Free shipping on orders over {formatPrice(50)}
                </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;