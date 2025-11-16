import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Event Coordinator',
    company: 'Elite Events Co.',
    content: 'Outstanding quality and incredibly fast turnaround! Our event banners looked professional and withstood outdoor conditions perfectly. Will definitely use again.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
  },
  {
    name: 'Mike Chen',
    role: 'Marketing Director',
    company: 'TechStart Inc.',
    content: 'The design tools are intuitive and the real-time pricing is fantastic. Saved us hours compared to traditional print shops. Highly recommend!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    name: 'Lisa Rodriguez',
    role: 'Small Business Owner',
    company: 'Rodriguez Bakery',
    content: 'Perfect for our grand opening! The vinyl banner has been up for 6 months and still looks brand new. Great value for money.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  }
];

const businessTypes = [
  { name: 'Retail Stores', count: '2,500+' },
  { name: 'Restaurants', count: '1,800+' },
  { name: 'Event Companies', count: '3,200+' },
  { name: 'Real Estate', count: '1,400+' },
  { name: 'Construction', count: '900+' },
  { name: 'Healthcare', count: '600+' }
];

export const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands of Businesses
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers say about their banner printing experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-200" />
                  <p className="text-gray-700 italic pl-6">{testimonial.content}</p>
                </div>

                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Business Types */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Serving Diverse Industries
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {businessTypes.map((business, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl font-bold text-blue-600 mb-1">{business.count}</div>
                <div className="text-sm text-gray-600">{business.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};