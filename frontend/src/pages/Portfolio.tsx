import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Download, Star } from 'lucide-react';

const Portfolio: React.FC = () => {
  const portfolioItems = [
    {
      id: 1,
      title: "Wedding Banner - Tamil Style",
      category: "Wedding",
      size: "12x8 feet",
      material: "Flex",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=300&fit=crop",
      rating: 5
    },
    {
      id: 2,
      title: "Shop Opening Banner",
      category: "Business",
      size: "6x4 feet", 
      material: "Vinyl",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
      rating: 5
    },
    {
      id: 3,
      title: "Festival Celebration Banner",
      category: "Festival",
      size: "10x8 feet",
      material: "Fabric",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
      rating: 4
    },
    {
      id: 4,
      title: "Political Campaign Banner",
      category: "Political",
      size: "15x10 feet",
      material: "Flex",
      image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=500&h=300&fit=crop",
      rating: 5
    },
    {
      id: 5,
      title: "Restaurant Menu Board",
      category: "Business",
      size: "4x3 feet",
      material: "Vinyl",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop",
      rating: 4
    },
    {
      id: 6,
      title: "Event Announcement Banner",
      category: "Event",
      size: "8x6 feet",
      material: "Mesh",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&h=300&fit=crop",
      rating: 5
    }
  ];

  const categories = ["All", "Wedding", "Business", "Festival", "Political", "Event"];
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredItems = selectedCategory === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Our <span className="text-purple-400">Portfolio</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Showcasing our finest banner creations across Tamil Nadu
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-sm rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Size:</span>
                    <span className="text-purple-400">{item.size}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Material:</span>
                    <span className="text-purple-400">{item.material}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-gray-300 text-sm ml-2">({item.rating}/5)</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl border border-white/10"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your Banner?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join hundreds of satisfied customers across Tamil Nadu. Get your custom banner designed and printed with premium quality materials.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-600/25 transition-all duration-300 transform hover:scale-105">
            Start Your Order
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Portfolio;