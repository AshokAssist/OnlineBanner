import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { RegisterRequest } from '../types';

export const Register: React.FC = () => {
  const { register: registerUser, isAuthenticated, registerError, isRegisterLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterRequest & { confirmPassword: string }>();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (data: RegisterRequest & { confirmPassword: string }) => {
    const { confirmPassword, ...registerData } = data;
    registerUser(registerData);
  };

  const password = watch('password');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/50 via-transparent to-transparent"></div>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-40"
            animate={{
              x: [0, 150, -75, 0],
              y: [0, -120, 60, 0],
              scale: [1, 2, 0.5, 1],
              opacity: [0.4, 0.8, 0.2, 0.4]
            }}
            transition={{
              duration: 10 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${5 + i * 12}%`,
              top: `${10 + i * 8}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main Illustration */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl mb-6"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-4">Join Our Community!</h2>
                  <p className="text-gray-300">Start creating professional banners today</p>
                </div>
                
                {/* Benefits */}
                <div className="space-y-4 mb-8">
                  {[
                    'AI-Powered Design Tools',
                    'Premium Material Options',
                    '24/7 Customer Support',
                    'Fast Delivery Worldwide'
                  ].map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center text-white"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Sample Banners */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl p-4 text-white text-center"
                  >
                    <div className="text-sm font-bold">BUSINESS</div>
                    <div className="text-xs opacity-80">Professional</div>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="bg-gradient-to-r from-orange-500 to-red-400 rounded-xl p-4 text-white text-center"
                  >
                    <div className="text-sm font-bold">EVENT</div>
                    <div className="text-xs opacity-80">Creative</div>
                  </motion.div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-80"
              />
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-60"
              />
            </div>
          </motion.div>

          {/* Right Side - Register Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:mx-0"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl mb-6"
                >
                  <User className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-gray-300">Join thousands of happy customers</p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {registerError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6"
                  >
                    {registerError.message || 'Registration failed. Please try again.'}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters',
                        },
                      })}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-red-400"
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      type="email"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-red-400"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-red-400"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                          value === password || 'Passwords do not match',
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-red-400"
                    >
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isRegisterLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isRegisterLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-gray-300">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-pink-400 hover:text-pink-300 font-semibold transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};