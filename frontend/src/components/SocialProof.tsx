import { motion } from 'framer-motion';
import { Star, Users, Award, TrendingUp } from 'lucide-react';

const logos = [
  'https://via.placeholder.com/120x60/e5e7eb/6b7280?text=Company+1',
  'https://via.placeholder.com/120x60/e5e7eb/6b7280?text=Company+2',
  'https://via.placeholder.com/120x60/e5e7eb/6b7280?text=Company+3',
  'https://via.placeholder.com/120x60/e5e7eb/6b7280?text=Company+4',
  'https://via.placeholder.com/120x60/e5e7eb/6b7280?text=Company+5',
];

const recentOrders = [
  { customer: 'Sarah M.', location: 'New York', item: '4x8 Vinyl Banner', time: '2 minutes ago' },
  { customer: 'Mike R.', location: 'California', item: '3x6 Mesh Banner', time: '5 minutes ago' },
  { customer: 'Lisa K.', location: 'Texas', item: '2x4 Fabric Banner', time: '8 minutes ago' },
];

export const SocialProof = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <span className="text-2xl font-bold text-gray-900 ml-2">4.9/5</span>
            </div>
            <p className="text-gray-600">Customer Rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900 ml-2">50K+</span>
            </div>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-6 h-6 text-green-500" />
              <span className="text-2xl font-bold text-gray-900 ml-2">99%</span>
            </div>
            <p className="text-gray-600">On-Time Delivery</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              <span className="text-2xl font-bold text-gray-900 ml-2">24hr</span>
            </div>
            <p className="text-gray-600">Fast Turnaround</p>
          </div>
        </div>

        {/* Company Logos */}
        <div className="mb-16">
          <p className="text-center text-gray-600 mb-8">Trusted by leading companies</p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            {logos.map((logo, index) => (
              <motion.img
                key={index}
                src={logo}
                alt={`Company ${index + 1}`}
                className="h-12 grayscale hover:grayscale-0 transition-all"
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            🔥 Recent Orders - Join the Success!
          </h3>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {order.customer.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{order.customer} from {order.location}</p>
                    <p className="text-sm text-gray-600">ordered {order.item}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{order.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};