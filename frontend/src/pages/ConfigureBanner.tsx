import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Upload, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Palette,
  Ruler,
  Package,
  Sparkles
} from 'lucide-react';
import { BannerForm } from '../components/BannerForm';
import { FileUpload } from '../components/FileUpload';
import { BannerConfig, CartItem } from '../types';
import { useCartStore } from '../state/cartStore';

export const ConfigureBanner: React.FC = () => {
  const [step, setStep] = useState<'config' | 'upload'>('config');
  const [config, setConfig] = useState<BannerConfig | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const location = useLocation();
  const editItem = location.state?.editItem;

  const navigate = useNavigate();

  useEffect(() => {
    if (editItem) {
      setConfig(editItem.config);
      setFile(editItem.file);
      setEditingItem(editItem);
      if (editItem.file) {
        setStep('upload');
      }
    }
  }, [editItem]);

  const handleConfigSubmit = (bannerConfig: BannerConfig) => {
    setConfig(bannerConfig);
    setStep('upload');
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // Don't change step in edit mode, just update the file
  };

  const handleAddToCart = () => {
    if (!config || !file) return;

    const cartItem = {
      config,
      file,
      price: calculatePrice(config)
    };

    const { addItem, removeItem } = useCartStore.getState();
    
    if (editingItem) {
      // Remove old item and add updated one
      removeItem(editingItem.id);
      addItem(cartItem);
      alert('Item updated in cart!');
    } else {
      // Add new item
      addItem(cartItem);
      alert('Item added to cart!');
    }
    
    navigate('/cart');
  };

  // Indian price calculation in INR
  const calculatePrice = (config: BannerConfig): number => {
    const area = (config.widthCm * config.heightCm) / 10000; // Convert to square meters
    
    // Tiered pricing in INR
    let baseRate = 800; // ₹800 per sqm for small
    if (area > 0.5) baseRate = 600; // ₹600 per sqm for medium
    if (area > 2.0) baseRate = 450; // ₹450 per sqm for large
    if (area > 5.0) baseRate = 350; // ₹350 per sqm for extra large
    
    let basePrice = area * baseRate;

    // Material multipliers
    switch (config.material) {
      case 'fabric':
        basePrice *= 1.4;
        break;
      case 'mesh':
        basePrice *= 1.2;
        break;
      case 'vinyl':
        basePrice *= 0.8;
        break;
      default: // vinyl
        break;
    }

    // Add-ons in INR
    if (config.grommets) basePrice += 200;
    if (config.lamination) basePrice += 300;

    return Math.max(basePrice, 150); // Minimum ₹150
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>
        {[...Array(5)].map((_, i) => (
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
              left: `${15 + i * 20}%`,
              top: `${20 + i * 15}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Design Your Perfect Banner
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Professional banner creation in just 2 simple steps
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center mb-12"
        >
          <div className="flex items-center space-x-8">
            {/* Step 1 */}
            <div className={`flex items-center ${step === 'config' ? 'text-blue-400' : config ? 'text-green-400' : 'text-gray-400'}`}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${
                  step === 'config' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : config 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                {config ? <CheckCircle className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
              </motion.div>
              <div className="ml-3">
                <div className="font-semibold">Configure</div>
                <div className="text-sm opacity-75">Size & Material</div>
              </div>
            </div>

            {/* Progress Line */}
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: '0%' }}
                animate={{ width: config ? '100%' : '0%' }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Step 2 */}
            <div className={`flex items-center ${step === 'upload' ? 'text-blue-400' : file ? 'text-green-400' : 'text-gray-400'}`}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${
                  step === 'upload' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : file 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                {file ? <CheckCircle className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
              </motion.div>
              <div className="ml-3">
                <div className="font-semibold">Upload</div>
                <div className="text-sm opacity-75">Your Artwork</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {step === 'config' && (
            <motion.div
              key="config"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="grid lg:grid-cols-2 gap-12 items-start"
            >
              {/* Left Side - Form */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center mb-6">
                  <Ruler className="w-6 h-6 text-blue-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Banner Specifications</h2>
                </div>
                <BannerForm onSubmit={handleConfigSubmit} initialValues={editingItem?.config} isEditing={!!editingItem} />
              </div>

              {/* Right Side - Preview */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center mb-6">
                  <Palette className="w-6 h-6 text-purple-400 mr-3" />
                  <h3 className="text-2xl font-bold text-white">Live Preview</h3>
                </div>
                
                <div className="space-y-6">
                  {/* Sample Banner */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-8 text-white text-center relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
                    <div className="relative z-10">
                      <h4 className="text-2xl font-bold mb-2">YOUR DESIGN HERE</h4>
                      <p className="opacity-90">Professional Quality Print</p>
                    </div>
                  </motion.div>

                  {/* Order Summary if config exists */}
                  {config && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-3">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-300">
                          <span>Size:</span>
                          <span>{config.widthCm} × {config.heightCm} cm</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Material:</span>
                          <span className="capitalize">{config.material}</span>
                        </div>
                        {config.grommets && (
                          <div className="flex justify-between text-gray-300">
                            <span>Grommets:</span>
                            <span>+₹200</span>
                          </div>
                        )}
                        {config.lamination && (
                          <div className="flex justify-between text-gray-300">
                            <span>Lamination:</span>
                            <span>+₹300</span>
                          </div>
                        )}
                        <div className="border-t border-white/20 pt-2 flex justify-between font-semibold text-white">
                          <span>Total:</span>
                          <span className="text-green-400">₹{calculatePrice(config).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {file && (
                        <div className="mt-4">
                          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 mb-3">
                            <div className="flex items-center text-green-400 mb-1">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              <span className="font-medium text-sm">File Ready</span>
                            </div>
                            <p className="text-xs text-gray-300 truncate">{file.name}</p>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddToCart}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center"
                          >
                            Add to Cart
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Features */}
                  {!config && (
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Package, label: 'Premium Materials', desc: 'Vinyl, Mesh, Fabric' },
                        { icon: CheckCircle, label: 'Weather Resistant', desc: 'UV Protected' },
                        { icon: Sparkles, label: 'HD Quality', desc: '1440 DPI Print' },
                        { icon: ArrowRight, label: 'Fast Delivery', desc: '24-48 Hours' }
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
                        >
                          <feature.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                          <div className="text-sm font-semibold text-white">{feature.label}</div>
                          <div className="text-xs text-gray-400">{feature.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'upload' && config && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Upload Section */}
              <div className="lg:col-span-2">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <Upload className="w-6 h-6 text-blue-400 mr-3" />
                      <h2 className="text-2xl font-bold text-white">Upload Your Artwork</h2>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStep('config')}
                      className="flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Config
                    </motion.button>
                  </div>
                  <FileUpload onFileSelect={handleFileSelect} initialFile={file} />
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Order Summary
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Dimensions:</span>
                    <span className="text-white font-medium">{config.widthCm} × {config.heightCm} cm</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Material:</span>
                    <span className="text-white font-medium capitalize">{config.material}</span>
                  </div>
                  {config.grommets && (
                    <div className="flex justify-between text-gray-300">
                      <span>Grommets:</span>
                      <span className="text-green-400 font-medium">+₹200.00</span>
                    </div>
                  )}
                  {config.lamination && (
                    <div className="flex justify-between text-gray-300">
                      <span>Lamination:</span>
                      <span className="text-green-400 font-medium">+₹300.00</span>
                    </div>
                  )}
                  <div className="border-t border-white/20 pt-4 flex justify-between">
                    <span className="text-lg font-bold text-white">Total:</span>
                    <span className="text-2xl font-bold text-green-400">₹{calculatePrice(config).toFixed(2)}</span>
                  </div>
                </div>

                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                      <div className="flex items-center text-green-400 mb-2">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="font-medium">File Ready</span>
                      </div>
                      <p className="text-sm text-gray-300 truncate">{file.name}</p>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center"
                    >
                      Add to Cart
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}


        </AnimatePresence>
      </div>
    </div>
  );
};