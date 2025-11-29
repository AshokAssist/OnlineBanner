import { apiClient } from './client';
import { Order, BannerConfig } from '../types';

export const ordersApi = {
  createOrder: async (items: { config: BannerConfig; file: File }[]): Promise<Order> => {
    const formData = new FormData();
    
    items.forEach((item) => {
      formData.append('files', item.file);
      formData.append('configs', JSON.stringify(item.config));
    });

    const response = await apiClient.post('/orders', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getUserOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders/me');
    console.log('🔍 Frontend /orders/me response:', {
      status: response.status,
      data: response.data,
      dataLength: response.data?.length,
      firstOrder: response.data?.[0]
    });
    return response.data;
  },

  getAllOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await apiClient.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  getEmailContent: async (orderId: string): Promise<any> => {
    const response = await apiClient.get(`/orders/${orderId}/email-content`);
    return response.data;
  },

  calculatePrice: async (config: BannerConfig): Promise<{ price: number }> => {
    const response = await apiClient.post('/orders/calculate-price', config);
    return response.data;
  },
};