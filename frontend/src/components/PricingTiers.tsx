import { motion } from 'framer-motion';
import { Check, Crown, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const tiers = [
  {
    name: 'Basic',
    price: 25,
    description: 'Perfect for small businesses',
    features: ['Standard vinyl material', 'Basic grommets', '3-5 day delivery', 'Email support'],
    color: 'from-gray-500 to-gray-600',
    popular: false
  },
  {
    name: 'Professional',
    price: 45,
    description: 'Most popular for events',
    features: ['Premium vinyl/mesh', 'Reinforced grommets', '24-48hr delivery', 'Phone support', 'Free design review'],
    color: 'from-blue-500 to-purple-600',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 85,
    description: 'For large campaigns',
    features: ['All materials available', 'Custom finishing', 'Same day delivery', 'Dedicated account manager', 'Bulk discounts'],
    color: 'from-yellow-500 to-orange-600',
    popular: false
  }
];

export const PricingTiers = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600">Flexible pricing for every business need</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${tier.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                  <span className="text-gray-600 ml-1">starting</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/configure">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${tier.color} hover:shadow-lg transition-shadow`}
                >
                  Get Started
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};