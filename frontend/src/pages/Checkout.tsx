import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ordersApi } from '../api/orders';
import { CartItem } from '../types';

export const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  const createOrderMutation = useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
      localStorage.removeItem('cart');
      navigate('/orders');
    },
    onError: (error) => {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    },
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const orderItems = cartItems.map(item => ({
      config: item.config,
      file: item.file,
    }));

    createOrderMutation.mutate(orderItems);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some banners to your cart to proceed with checkout.</p>
          <button
            onClick={() => navigate('/configure')}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md"
          >
            Configure a Banner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Order Items</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.config.widthCm} × {item.config.heightCm} cm Banner
                      </h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <p>Material: {item.config.material}</p>
                        <p>File: {item.file.name}</p>
                        {item.config.grommets && <p>• Grommets included</p>}
                        {item.config.lamination && <p>• Lamination included</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-lg">
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-2 text-sm">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.config.widthCm}×{item.config.heightCm}cm</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={createOrderMutation.isPending}
              className="w-full mt-6 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createOrderMutation.isPending ? 'Processing...' : 'Place Order'}
            </button>

            <div className="mt-4 text-xs text-gray-500">
              <p>• Files will be processed within 24 hours</p>
              <p>• You will receive email updates on order status</p>
              <p>• Production typically takes 2-3 business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};