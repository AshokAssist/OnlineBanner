import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../state/auth';

export const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const floatingAnimation = useSpring({
    transform: isHovered ? 'translateY(-10px) rotate(2deg)' : 'translateY(0px) rotate(0deg)',
    config: { tension: 300, friction: 10 }
  });

  const backgroundAnimation = useSpring({
    background: isHovered 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    config: { duration: 1000 }
  });

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <animated.div 
        style={backgroundAnimation}
        className="absolute inset-0 opacity-10"
      />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div
              variants={textVariants}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-800 mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Premium Banner Printing
            </motion.div>

            <motion.h1
              variants={textVariants}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create Stunning
              </span>
              <br />
              <span className="text-gray-900">Banners</span>
            </motion.h1>

            <motion.p
              variants={textVariants}
              className="text-xl text-gray-600 mb-8 max-w-2xl"
            >
              Transform your ideas into eye-catching banners with our advanced design tools, 
              premium materials, and lightning-fast delivery.
            </motion.p>

            <motion.div
              variants={textVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {isAuthenticated ? (
                <Link to="/configure">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                  >
                    Start Designing
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              ) : (
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center border border-gray-200"
                onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="mr-2 w-5 h-5" />
                View Examples
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={textVariants}
              className="mt-12 grid grid-cols-3 gap-8"
            >
              {[
                { value: '50K+', label: 'Banners Printed' },
                { value: '99%', label: 'Satisfaction Rate' },
                { value: '24h', label: 'Fast Delivery' }
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Banner Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <animated.div
              style={floatingAnimation}
              className="relative bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm"
            >
              {/* Mock Banner Design Interface */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="relative z-10"
                  >
                    <h4 className="text-xl font-bold mb-2">GRAND OPENING</h4>
                    <p className="text-sm opacity-90 mb-1">50% OFF Everything!</p>
                    <p className="text-xs opacity-75">Visit us this weekend</p>
                  </motion.div>
                  <div className="absolute top-2 right-2 bg-white/20 px-2 py-1 rounded text-xs">
                    Sample Design
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-2">Size</div>
                    <div className="font-semibold">4x8 feet</div>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-2">Material</div>
                    <div className="font-semibold">Vinyl</div>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-2">Grommets</div>
                    <div className="font-semibold">Yes</div>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-2">Price</div>
                    <div className="font-semibold text-green-600">$89.99</div>
                  </div>
                </div>

                <Link to={isAuthenticated ? "/configure" : "/register"}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold"
                  >
                    {isAuthenticated ? 'Create Similar Banner' : 'Sign Up to Design'}
                  </motion.button>
                </Link>
              </div>
            </animated.div>

            {/* Floating Elements Around Preview */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-80"
            />
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-80"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};