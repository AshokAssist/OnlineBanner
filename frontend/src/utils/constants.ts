export const APP_CONFIG = {
  API_BASE: import.meta.env.VITE_API_BASE || 'http://localhost:8000/api',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENVIRONMENT: import.meta.env.MODE || 'development',
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  CART: 'banner_cart',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders/me',
    ADMIN_LIST: '/orders',
    CALCULATE_PRICE: '/orders/calculate-price',
  },
} as const;

export const BANNER_MATERIALS = {
  VINYL: 'vinyl',
  FABRIC: 'fabric', 
  MESH: 'mesh',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;