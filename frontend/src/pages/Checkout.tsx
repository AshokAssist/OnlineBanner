import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../state/cartStore';
import { CartItem } from '../types';

export const Checkout: React.FC = () => {
  const { items: cartItems, clearCart } = useCartStore();
  const [isPlacing, setIsPlacing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneError, setPhoneError] = useState('');
  const navigate = useNavigate();

  const countryCodes = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' }
  ];
  
  const validatePhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, '');
    if (countryCode === '+91') {
      if (cleaned.length !== 10) {
        setPhoneError('Please enter 10 digits');
        return false;
      }
      if (!cleaned.match(/^[6-9]/)) {
        setPhoneError('Indian mobile numbers start with 6-9');
        return false;
      }
    } else {
      if (cleaned.length < 7 || cleaned.length > 15) {
        setPhoneError('Please enter a valid phone number');
        return false;
      }
    }
    setPhoneError('');
    return true;
  };
  
  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 15);
    setPhoneNumber(cleaned);
    validatePhoneNumber(cleaned);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || !phoneNumber.trim()) return;

    setIsPlacing(true);
    try {
      for (const item of cartItems) {
        const formData = new FormData();
        if (item.file) {
          formData.append('files', item.file);
        }
        formData.append('configs', JSON.stringify(item.config));
        formData.append('contact_number', `${countryCode}-${phoneNumber}`);

        const response = await fetch('http://localhost:8000/api/orders', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to create order: ${response.status}`);
        }
      }

      clearCart();
      alert('Orders placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to place orders. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
            <p className="text-gray-300 mb-8">Add some banners to your cart to proceed with checkout.</p>
            <button
              onClick={() => navigate('/configure')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2 px-4 rounded-md"
            >
              Configure a Banner
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Contact Number *</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[120px]"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code} className="bg-slate-800">
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="9876543210"
                    className={`flex-1 bg-white/10 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 ${
                      phoneError ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-purple-500'
                    }`}
                    maxLength={15}
                  />
                </div>
                {phoneError && (
                  <p className="text-xs text-red-400 mt-1">{phoneError}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">We'll contact you for order updates and delivery</p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">Order Items</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="border border-white/20 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-white">
                          {item.config.widthCm} × {item.config.heightCm} cm Banner (Qty: {item.quantity})
                        </h3>
                        <div className="text-sm text-gray-300 mt-1">
                          <p>Material: {item.config.material}</p>
                          {item.file && <p>File: {item.file.name}</p>}
                          {item.config.grommets && <p>• Grommets included</p>}
                          {item.config.lamination && <p>• Lamination included</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-lg text-purple-400">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10 sticky top-4">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-2 text-sm">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-300">
                    <span>{item.config.widthCm}×{item.config.heightCm}cm (×{item.quantity})</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-gray-300">
                  <span>Processing Fee</span>
                  <span>₹50.00</span>
                </div>
                <div className="border-t border-white/20 pt-2 mt-4">
                  <div className="flex justify-between font-semibold text-lg text-white">
                    <span>Total:</span>
                    <span>₹{(getTotalPrice() + 50).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacing || !phoneNumber.trim() || phoneError !== ''}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-3 px-4 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacing ? 'Placing Orders...' : 'Place Order'}
              </button>

              <div className="mt-4 text-xs text-gray-400">
                <p>• Files will be processed within 24 hours</p>
                <p>• You will receive email updates on order status</p>
                <p>• Production typically takes 2-3 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};