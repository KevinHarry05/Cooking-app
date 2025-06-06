import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, FoodItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: FoodItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
  getItemQuantity: (itemId: string) => number;
}

const isBrowser = typeof window !== 'undefined';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item: FoodItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          
          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });
      },
      
      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },
      
      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getItemQuantity: (itemId: string) => {
        const item = get().items.find((item) => item.id === itemId);
        return item?.quantity || 0;
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => ({
        getItem: (name: string) => {
          try {
            if (isBrowser && window.localStorage) {
              return window.localStorage.getItem(name);
            }
            return null;
          } catch (error) {
            console.warn('Error accessing localStorage:', error);
            return null;
          }
        },
        setItem: (name: string, value: string) => {
          try {
            if (isBrowser && window.localStorage) {
              window.localStorage.setItem(name, value);
            }
          } catch (error) {
            console.warn('Error setting localStorage:', error);
          }
        },
        removeItem: (name: string) => {
          try {
            if (isBrowser && window.localStorage) {
              window.localStorage.removeItem(name);
            }
          } catch (error) {
            console.warn('Error removing from localStorage:', error);
          }
        },
      })),
    }
  )
);