import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { BannerConfig } from '../types';
import { ordersApi } from '../api/orders';
import { useEffect, useState } from 'react';

interface BannerFormProps {
  onSubmit: (config: BannerConfig) => void;
  initialValues?: Partial<BannerConfig>;
  isEditing?: boolean;
}

export const BannerForm: React.FC<BannerFormProps> = ({ onSubmit, initialValues, isEditing }) => {
  const [selectedSize, setSelectedSize] = useState('Flex Board Small');
  const [customSize, setCustomSize] = useState({ width: 100, height: 50 });
  
  const indianSizes = [
    { name: "Flex Board Small", width: 60, height: 90, category: "small" },
    { name: "Vinyl Sticker", width: 30, height: 45, category: "small" },
    { name: "Shop Board", width: 90, height: 60, category: "small" },
    { name: "Flex Banner 4x3", width: 120, height: 90, category: "medium" },
    { name: "Flex Banner 6x4", width: 180, height: 120, category: "medium" },
    { name: "Event Banner", width: 150, height: 100, category: "medium" },
    { name: "Flex Banner 8x6", width: 240, height: 180, category: "large" },
    { name: "Flex Banner 10x8", width: 300, height: 240, category: "large" },
    { name: "Wedding Banner", width: 360, height: 240, category: "large" },
    { name: "Flex Banner 12x8", width: 360, height: 240, category: "xlarge" },
    { name: "Flex Banner 15x10", width: 450, height: 300, category: "xlarge" },
    { name: "Hoarding Banner", width: 600, height: 300, category: "xlarge" },
    { name: "Custom Size", width: 0, height: 0, category: "custom" }
  ];
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BannerConfig>({
    defaultValues: {
      widthCm: initialValues?.widthCm || 60,
      heightCm: initialValues?.heightCm || 90,
      material: initialValues?.material || 'vinyl',
      grommets: initialValues?.grommets || false,
      lamination: initialValues?.lamination || false,
    },
  });
  
  useEffect(() => {
    if (initialValues) {
      setValue('widthCm', initialValues.widthCm || 60);
      setValue('heightCm', initialValues.heightCm || 90);
      setValue('material', initialValues.material || 'vinyl');
      setValue('grommets', initialValues.grommets || false);
      setValue('lamination', initialValues.lamination || false);
      
      // Find matching size or set to custom
      const matchingSize = indianSizes.find(s => 
        s.width === initialValues.widthCm && s.height === initialValues.heightCm
      );
      setSelectedSize(matchingSize?.name || 'Custom Size');
    }
  }, [initialValues, setValue]);
  
  const handleSizeChange = (sizeKey: string) => {
    setSelectedSize(sizeKey);
    if (sizeKey !== 'Custom Size') {
      const size = indianSizes.find(s => s.name === sizeKey);
      if (size && size.width > 0) {
        setValue('widthCm', size.width);
        setValue('heightCm', size.height);
      }
    }
  };

  const watchedValues = watch();

  const { data: priceData, isLoading: isPriceLoading, error: priceError } = useQuery({
    queryKey: ['price', watchedValues],
    queryFn: () => ordersApi.calculatePrice(watchedValues),
    enabled: !!(watchedValues.widthCm && watchedValues.heightCm && watchedValues.material),
    retry: 1,
    staleTime: 30000,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-6">
        {/* Standard Size Selector */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Banner Size (Tamil Nadu Standard)
          </label>
          <select
            value={selectedSize}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {indianSizes.map((size) => (
              <option key={size.name} value={size.name} className="bg-slate-800 text-white">
                {size.name} {size.width > 0 && `(${size.width} × ${size.height} cm)`}
              </option>
            ))}
          </select>
        </div>
        
        {/* Custom Size Inputs */}
        {selectedSize === 'Custom Size' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Width (cm)
              </label>
              <input
                type="number"
                {...register('widthCm', { 
                  required: 'Width is required',
                  min: { value: 10, message: 'Minimum width is 10cm' },
                  max: { value: 1000, message: 'Maximum width is 1000cm' }
                })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.widthCm && (
                <p className="mt-1 text-sm text-red-400">{errors.widthCm.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                {...register('heightCm', { 
                  required: 'Height is required',
                  min: { value: 10, message: 'Minimum height is 10cm' },
                  max: { value: 1000, message: 'Maximum height is 1000cm' }
                })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.heightCm && (
                <p className="mt-1 text-sm text-red-400">{errors.heightCm.message}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Material
          </label>
          <select
            {...register('material', { required: 'Material is required' })}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="vinyl" className="bg-slate-800">Vinyl (Standard)</option>
            <option value="flex" className="bg-slate-800">Flex (Budget - 20% off)</option>
            <option value="fabric" className="bg-slate-800">Fabric (Premium +40%)</option>
            <option value="mesh" className="bg-slate-800">Mesh (Wind Resistant +20%)</option>
          </select>
          {errors.material && (
            <p className="mt-1 text-sm text-red-400">{errors.material.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10">
            <input
              type="checkbox"
              {...register('grommets')}
              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-white/20 rounded bg-white/10"
            />
            <label className="ml-3 block text-sm text-white">
              Add Grommets (+₹200)
              <span className="block text-xs text-gray-400">Metal eyelets for easy hanging</span>
            </label>
          </div>

          <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10">
            <input
              type="checkbox"
              {...register('lamination')}
              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-white/20 rounded bg-white/10"
            />
            <label className="ml-3 block text-sm text-white">
              Add Lamination (+₹300)
              <span className="block text-xs text-gray-400">Weather protection coating</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-6 rounded-xl border border-white/10">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-white">
            Estimated Price:
          </span>
          <span className="text-3xl font-bold text-purple-400">
            {isPriceLoading ? (
              <div className="animate-pulse text-gray-400">Loading...</div>
            ) : priceError ? (
              <div className="text-red-400 text-sm">Price unavailable</div>
            ) : (
              `₹${Number(priceData?.price || 0).toFixed(2)}`
            )}
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-600/25"
      >
        {isEditing ? 'Update Configuration' : 'Continue to Upload'}
      </button>
    </form>
  );
};