import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Plus, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../api/orders';
import { OrderCard } from '../components/OrderCard';

export const Orders: React.FC = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', 'user'],
    queryFn: ordersApi.getUserOrders,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Error Loading Orders</h1>
          <p className="text-gray-300">Failed to load your orders. Please try again later.</p>
        </motion.div>
      </div>
    );
  }

  const orderStats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    processing: orders?.filter(o => o.status === 'processing').length || 0,
    completed: orders?.filter(o => o.status === 'completed').length || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-30"
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -80, 40, 0],
              scale: [1, 1.5, 0.8, 1]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 25}%`,
              top: `${15 + i * 20}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
        >
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">My Orders</h1>
                <p className="text-gray-300">Track and manage your banner orders</p>
              </div>
            </div>
          </div>
          
          <Link to="/configure">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Order
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        {orders && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { label: 'Total Orders', value: orderStats.total, icon: Package, color: 'from-blue-500 to-cyan-500' },
              { label: 'Pending', value: orderStats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500' },
              { label: 'Processing', value: orderStats.processing, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
              { label: 'Completed', value: orderStats.completed, icon: CheckCircle, color: 'from-green-500 to-emerald-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Orders Content */}
        <AnimatePresence>
          {!orders || orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl max-w-2xl mx-auto">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Create Your First Banner?</h3>
                <p className="text-gray-300 mb-8 text-lg">
                  Start your banner printing journey with our easy-to-use design tools and premium materials.
                </p>
                
                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Sparkles, label: 'AI Design Tools' },
                    { icon: Package, label: 'Premium Materials' },
                    { icon: CheckCircle, label: 'Fast Delivery' }
                  ].map((benefit, index) => (
                    <motion.div
                      key={benefit.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
                    >
                      <benefit.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-sm text-white">{benefit.label}</div>
                    </motion.div>
                  ))}
                </div>
                
                <Link to="/configure">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all inline-flex items-center"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Configure Your First Banner
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <OrderCard order={order} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};