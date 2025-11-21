import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Package, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  IndianRupee,
  BarChart3
} from 'lucide-react';
import { ordersApi } from '../api/orders';
import { OrderCard } from '../components/OrderCard';

export const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', 'all'],
    queryFn: ordersApi.getAllOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      ordersApi.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'all'] });
    },
    onError: (error) => {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    },
  });

  const handleStatusUpdate = (orderId: string, status: string) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  const handleViewEmail = async (orderId: string) => {
    try {
      const emailData = await ordersApi.getEmailContent(orderId);
      // Open email content in a new window
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Order Email - ${emailData.order_id}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                .content { line-height: 1.6; }
                table { border-collapse: collapse; width: 100%; margin: 15px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>Email Content for Order #${emailData.order_id}</h2>
                <p><strong>Subject:</strong> ${emailData.email_subject}</p>
                <p><strong>Customer Email:</strong> ${emailData.customer_email}</p>
                <p><strong>Contact Number:</strong> ${emailData.contact_number}</p>
                <p><strong>Files:</strong> ${emailData.files_info}</p>
              </div>
              <div class="content">
                ${emailData.email_content}
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    } catch (error) {
      console.error('Failed to get email content:', error);
      alert('Failed to load email content. Please try again.');
    }
  };

  const getOrderStats = () => {
    if (!orders) return { total: 0, pending: 0, processing: 0, completed: 0 };
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      completed: orders.filter(o => o.status === 'completed').length,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
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
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-300">Failed to load admin dashboard. Please try again later.</p>
        </motion.div>
      </div>
    );
  }

  const stats = getOrderStats();
  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_price || order.totalPrice || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent"></div>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-30"
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
              left: `${15 + i * 15}%`,
              top: `${20 + i * 12}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Manage orders and monitor business performance</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            { 
              label: 'Total Orders', 
              value: stats.total, 
              icon: Package, 
              color: 'from-blue-500 to-cyan-500',
              bgColor: 'bg-blue-500/20 border-blue-500/30'
            },
            { 
              label: 'Pending', 
              value: stats.pending, 
              icon: Clock, 
              color: 'from-yellow-500 to-orange-500',
              bgColor: 'bg-yellow-500/20 border-yellow-500/30'
            },
            { 
              label: 'Processing', 
              value: stats.processing, 
              icon: TrendingUp, 
              color: 'from-purple-500 to-pink-500',
              bgColor: 'bg-purple-500/20 border-purple-500/30'
            },
            { 
              label: 'Completed', 
              value: stats.completed, 
              icon: CheckCircle, 
              color: 'from-green-500 to-emerald-500',
              bgColor: 'bg-green-500/20 border-green-500/30'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`px-3 py-1 ${stat.bgColor} border rounded-lg`}>
                  <span className="text-xs font-medium text-white">Live</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-12 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Total Revenue</h3>
              <p className="text-green-100">Lifetime earnings from all orders</p>
            </div>
            <div className="flex items-center">
              <IndianRupee className="w-8 h-8 text-white mr-2" />
              <span className="text-4xl font-bold text-white">{Number(totalRevenue).toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
        >
          <div className="px-8 py-6 border-b border-white/20">
            <div className="flex items-center">
              <BarChart3 className="w-6 h-6 text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">All Orders</h2>
              <span className="ml-3 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium">
                {stats.total} Total
              </span>
            </div>
          </div>
          <div className="p-8">
            {!orders || orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Orders Yet</h3>
                <p className="text-gray-300">Orders will appear here when customers start placing them.</p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <OrderCard
                      order={order}
                      isAdmin={true}
                      onStatusUpdate={handleStatusUpdate}
                      onViewEmail={handleViewEmail}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};