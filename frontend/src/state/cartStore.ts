import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  config: {
    widthCm: number;
    heightCm: number;
    material: string;
    grommets: boolean;
    lamination: boolean;
  };
  file: File | null;
  fileName?: string; // Store filename for display when file is lost
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const newItem: CartItem = {
          ...item,
          id: Date.now().toString(),
          quantity: 1,
          fileName: item.file?.name, // Store filename
        };
        
        set((state) => ({
          items: [...state.items, newItem],
        }));
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'banner-cart',
      // Don't persist files in localStorage but keep filename
      partialize: (state) => ({
        ...state,
        items: state.items.map(item => ({
          ...item,
          file: null, // Don't persist files
          fileName: item.file?.name || item.fileName // Keep filename
        }))
      }),
    }
  )
);