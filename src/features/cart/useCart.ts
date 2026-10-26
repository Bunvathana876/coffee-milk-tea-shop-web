import { createContext, useContext } from 'react';
import type { CartState, CartItem } from '../../types';

export interface CartContextType {
  state: CartState;
  items: CartItem[];
  totalQuantity: number;
  subtotalUsd: number;
  totalPriceUsd: number;
  totalPriceKhr: number;
  addItem: (item: Omit<CartItem, 'id' | 'subtotalUsd'>) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

