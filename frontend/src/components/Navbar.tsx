import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, X, User, ShoppingBag, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
              >
                <span className="text-white font-bold text-sm">B</span>
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Banner Print Pro
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Home
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/portfolio"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Portfolio
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/configure"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Configure Banner
              </Link>
            </motion.div>
            {isAuthenticated && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/cart"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Cart
                </Link>
              </motion.div>
            )}
            {isAuthenticated && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Orders</span>
                </Link>
              </motion.div>
            )}
            {user?.isAdmin && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              </motion.div>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.name}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-sm rounded-lg mt-2 shadow-lg">
                <Link
                  to="/"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/portfolio"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Portfolio
                </Link>
                <Link
                  to="/configure"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Configure Banner
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/cart"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Cart
                  </Link>
                )}
                {isAuthenticated && (
                  <Link
                    to="/orders"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    My Orders
                  </Link>
                )}
                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-gray-700 text-base font-medium border-t mt-2 pt-2">
                      Hello, {user?.name}
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 rounded-md text-base font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t mt-2 pt-2">
                      <Link
                        to="/login"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-base font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-3 py-2 text-blue-600 hover:text-blue-700 rounded-md text-base font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Register
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
