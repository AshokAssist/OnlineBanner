import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Gift, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const LeadCapture = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("sending mail")
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Welcome! Check your email for your 20% discount code!');
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
            <Gift className="w-8 h-8" />
          </div>
          
          <h2 className="text-4xl font-bold mb-4">
            Get 20% Off Your First Order!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 10,000+ businesses getting exclusive deals and design tips
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-red-500 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Get Discount
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          <p className="text-sm opacity-75 mt-4">
            No spam, unsubscribe anytime. By signing up, you agree to our terms.
          </p>

          <div className="flex items-center justify-center space-x-8 mt-8 text-sm opacity-90">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              Free design consultation
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              Priority customer support
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              Exclusive member pricing
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};