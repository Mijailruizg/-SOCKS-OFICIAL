import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, MessageCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const whatsappNumber = '51974206791';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-center">Order Sent!</h1>
        <p className="text-gray-600 mb-8 text-center">
            Your order details have been sent to WhatsApp. We'll contact you shortly to confirm and process your order.
        </p>

        <div className="bg-green-50 p-4 rounded-lg text-left mb-6 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="text-green-600 w-5 h-5" />
                <span className="font-medium text-green-900">WhatsApp Notification</span>
            </div>
            <p className="text-sm text-green-800 ml-8">
                Order sent to: <strong>+51 974 206 791</strong>
            </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg text-left mb-8 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
                <Package className="text-blue-600 w-5 h-5" />
                <span className="font-medium text-blue-900">What's Next</span>
            </div>
            <ul className="text-sm text-blue-800 ml-8 space-y-1">
                <li>✓ We received your order</li>
                <li>✓ We'll confirm via WhatsApp</li>
                <li>✓ We'll provide payment instructions</li>
                <li>✓ Estimated delivery: 3-5 days</li>
            </ul>
        </div>

        <div className="space-y-3">
            <Link to="/">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    RETURN TO HOME
                </Button>
            </Link>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
            Make sure your WhatsApp number is updated so we can contact you.
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;