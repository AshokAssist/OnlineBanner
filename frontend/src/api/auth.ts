import { apiClient } from './client';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    const { user, ...rest } = response.data;
    return {
      ...rest,
      user: {
        ...user,
        isAdmin: user.is_admin
      }
    };
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    const { user, ...rest } = response.data;
    return {
      ...rest,
      user: {
        ...user,
        isAdmin: user.is_admin
      }
    };
  },

  refresh: async (refreshToken: string): Promise<{ access_token: string }> => {
    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};