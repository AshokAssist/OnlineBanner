import { motion } from 'framer-motion';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Mail,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';
import { Order } from '../types';

interface OrderCardProps {
  order: Order;
  isAdmin?: boolean;
  onStatusUpdate?: (orderId: string, status: string) => void;
  onViewEmail?: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  isAdmin = false, 
  onStatusUpdate,
  onViewEmail 
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
          icon: Clock,
          gradient: 'from-yellow-500 to-orange-500'
        };
      case 'processing':
        return {
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          icon: Package,
          gradient: 'from-blue-500 to-purple-500'
        };
      case 'completed':
        return {
          color: 'bg-green-500/20 text-green-300 border-green-500/30',
          icon: CheckCircle,
          gradient: 'from-green-500 to-emerald-500'
        };
      case 'cancelled':
        return {
          color: 'bg-red-500/20 text-red-300 border-red-500/30',
          icon: XCircle,
          gradient: 'from-red-500 to-pink-500'
        };
      default:
        return {
          color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
          icon: Package,
          gradient: 'from-gray-500 to-gray-600'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const totalPrice = Number(order.total_price || order.totalPrice || 0);
  const createdAt = order.created_at || order.createdAt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${statusConfig.gradient} rounded-xl flex items-center justify-center`}>
            <StatusIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Order #{order.id.slice(-8)}
            </h3>
            <div className="flex items-center text-gray-300 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(createdAt)}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-xl text-xs font-semibold border ${statusConfig.color} flex items-center`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <div className="flex items-center text-green-400 font-bold text-lg">
            <DollarSign className="w-5 h-5" />
            {totalPrice.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {order.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Package className="w-4 h-4 text-blue-400 mr-2" />
                  <p className="font-semibold text-white">
                    {item.banner_config?.width_cm || item.config?.widthCm} × {item.banner_config?.height_cm || item.config?.heightCm} cm
                  </p>
                </div>
                <p className="text-sm text-gray-300 mb-2">
                  Material: <span className="text-blue-400 capitalize">{item.banner_config?.material || item.config?.material}</span>
                  {(item.banner_config?.grommets || item.config?.grommets) && (
                    <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Grommets</span>
                  )}
                  {(item.banner_config?.lamination || item.config?.lamination) && (
                    <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">Lamination</span>
                  )}
                </p>
                <div className="flex items-center text-gray-400 text-sm">
                  <FileText className="w-3 h-3 mr-1" />
                  {item.file_name || item.fileName}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-bold text-green-400 text-lg">
                  ${Number(item.price || 0).toFixed(2)}
                </span>
                {isAdmin && onViewEmail && index === 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onViewEmail(order.id)}
                    className="flex items-center px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm font-medium"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    View Email
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {isAdmin && onStatusUpdate && (
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-300">
              Update Status:
            </label>
            <select
              value={order.status}
              onChange={(e) => onStatusUpdate(order.id, e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending" className="bg-gray-800">Pending</option>
              <option value="processing" className="bg-gray-800">Processing</option>
              <option value="completed" className="bg-gray-800">Completed</option>
              <option value="cancelled" className="bg-gray-800">Cancelled</option>
            </select>
          </div>
        </div>
      )}
    </motion.div>
  );
};