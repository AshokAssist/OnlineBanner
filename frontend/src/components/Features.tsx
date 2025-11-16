import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Truck, 
  Shield, 
  Palette, 
  Clock, 
  Award, 
  Users,
  Zap,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Custom Design Tools',
    description: 'Easy-to-use design interface with real-time preview and professional templates',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Shield,
    title: 'Premium Materials',
    description: 'Weather-resistant vinyl, mesh, and fabric options with UV protection',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: '24-48 hour turnaround with free shipping on orders over $50',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Clock,
    title: 'Quick Setup',
    description: 'Upload your design, choose specifications, and order in under 5 minutes',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Award,
    title: 'Quality Guarantee',
    description: '100% satisfaction guarantee with free reprints if not completely satisfied',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: 'Dedicated customer service team to help with design and technical questions',
    color: 'from-teal-500 to-blue-500'
  }
];

const processes = [
  {
    step: '01',
    title: 'Upload Design',
    description: 'Upload your artwork or use our design tools to create your banner',
    icon: Zap
  },
  {
    step: '02', 
    title: 'Choose Specs',
    description: 'Select size, material, finishing options with instant price calculation',
    icon: CheckCircle
  },
  {
    step: '03',
    title: 'Review & Order',
    description: 'Preview your banner, confirm details, and place your order securely',
    icon: Award
  },
  {
    step: '04',
    title: 'Fast Production',
    description: 'Professional printing and quality check before fast shipping to you',
    icon: Truck
  }
];

export const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Banner Printing?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional quality, fast turnaround, and exceptional service for all your banner needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Process Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple 4-Step Process</h2>
            <p className="text-xl opacity-90">From design to delivery in just a few clicks</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processes.map((process, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <process.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {process.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{process.title}</h3>
                <p className="text-sm opacity-90">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};