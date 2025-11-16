import { motion } from 'framer-motion';
import { Gift, Star, Trophy, Percent } from 'lucide-react';

const benefits = [
  {
    icon: Star,
    title: 'Earn Points',
    description: 'Get 1 point for every $1 spent',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    icon: Gift,
    title: 'Redeem Rewards',
    description: '100 points = $10 off your next order',
    color: 'from-green-400 to-blue-500'
  },
  {
    icon: Trophy,
    title: 'VIP Status',
    description: 'Unlock exclusive discounts and priority support',
    color: 'from-purple-400 to-pink-500'
  },
  {
    icon: Percent,
    title: 'Member Discounts',
    description: 'Up to 20% off on bulk orders',
    color: 'from-blue-400 to-indigo-500'
  }
];

export const LoyaltyProgram = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            Join Our Loyalty Program
          </motion.h2>
          <p className="text-xl opacity-90">Earn rewards with every banner you order</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl mb-4`}>
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="opacity-90">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-shadow"
          >
            Join Free Today
          </motion.button>
        </div>
      </div>
    </section>
  );
};