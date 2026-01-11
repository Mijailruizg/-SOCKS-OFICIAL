import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrderConfirmationPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-lg text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8">
            Thank you for your purchase. Your order <span className="font-mono font-bold text-black">#{id.slice(0,8)}</span> has been received.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg text-left mb-8">
            <div className="flex items-center gap-3 mb-2">
                <Package className="text-purple-600" />
                <span className="font-medium">Estimated Delivery</span>
            </div>
            <p className="text-sm text-gray-600 ml-9">3-5 Business Days</p>
        </div>

        <div className="space-y-3">
            <Link to="/orders">
                <Button variant="outline" className="w-full">View Order Status</Button>
            </Link>
            <Link to="/">
                <Button className="w-full bg-black hover:bg-gray-800">Continue Shopping</Button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;