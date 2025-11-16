export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface BannerConfig {
  widthCm: number;
  heightCm: number;
  material: 'vinyl' | 'fabric' | 'mesh';
  grommets: boolean;
  lamination: boolean;
}

export interface CartItem {
  id: string;
  config: BannerConfig;
  file: File;
  price: number;
}

export interface Order {
  id: string;
  userId?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalPrice: number;
  total_price?: number; // Backend uses snake_case
  createdAt: string;
  created_at?: string; // Backend uses snake_case
  updated_at?: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  config?: BannerConfig; // For backward compatibility
  banner_config?: {
    id: string;
    width_cm: number;
    height_cm: number;
    material: 'vinyl' | 'fabric' | 'mesh';
    grommets: boolean;
    lamination: boolean;
    calculated_price: number;
  };
  fileName?: string; // For backward compatibility
  file_name?: string; // Backend format
  fileUrl?: string; // For backward compatibility
  file_url?: string; // Backend format
  price: number;
  created_at?: string;
}

export interface CreateOrderRequest {
  items: {
    config: BannerConfig;
    file: File;
  }[];
}