import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../state/auth';

export const ModernHero = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/50 via-transparent to-transparent"></div>
      </div>

      {/* Floating Orbs */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -100, 50, 0],
              scale: [1, 1.5, 0.8, 1],
              opacity: [0.3, 0.8, 0.4, 0.3]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + i * 8}%`
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium text-white mb-8"
            >
              <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
              AI-Powered Banner Design
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl md:text-8xl font-black mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Create
              </span>
              <br />
              <span className="text-white">Banners</span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                That Convert
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed"
            >
              Revolutionary banner printing with AI-powered design tools, premium materials, 
              and lightning-fast delivery. Join 50,000+ businesses creating stunning banners.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to={isAuthenticated ? "/configure" : "/register"}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    {isAuthenticated ? 'Start Creating' : 'Get Started Free'}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-lg rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center"
                onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-16 grid grid-cols-3 gap-8"
            >
              {[
                { value: '50K+', label: 'Banners Created' },
                { value: '4.9★', label: 'Customer Rating' },
                { value: '24hr', label: 'Fast Delivery' }
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Banner Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <div className="relative">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-3xl blur-3xl"></div>
              
              {/* Main Preview Card */}
              <motion.div
                whileHover={{ rotateY: 5, rotateX: 5 }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">AI Design Studio</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Banner Preview */}
                <motion.div
                  animate={{ 
                    boxShadow: isHovered 
                      ? "0 25px 50px rgba(59, 130, 246, 0.4)" 
                      : "0 10px 30px rgba(0, 0, 0, 0.3)" 
                  }}
                  className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 rounded-2xl p-6 text-white text-center relative overflow-hidden mb-6"
                >
                  <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="relative z-10"
                  >
                    <h4 className="text-2xl font-black mb-2">GRAND OPENING</h4>
                    <p className="text-lg opacity-90 mb-1">50% OFF Everything!</p>
                    <p className="text-sm opacity-75">This Weekend Only</p>
                  </motion.div>
                  <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                    AI Generated
                  </div>
                </motion.div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Size', value: '4×8 ft' },
                    { label: 'Material', value: 'Premium Vinyl' },
                    { label: 'Finish', value: 'Weather Resistant' },
                    { label: 'Price', value: '$89.99', highlight: true }
                  ].map((spec, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 ${spec.highlight ? 'ring-2 ring-green-400' : ''}`}
                    >
                      <div className="text-sm text-gray-400 mb-1">{spec.label}</div>
                      <div className={`font-bold ${spec.highlight ? 'text-green-400' : 'text-white'}`}>
                        {spec.value}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Action Button */}
                <Link to={isAuthenticated ? "/configure" : "/register"}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {isAuthenticated ? 'Create Similar Design' : 'Start Free Trial'}
                  </motion.button>
                </Link>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-80 blur-sm"
              />
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-60"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};