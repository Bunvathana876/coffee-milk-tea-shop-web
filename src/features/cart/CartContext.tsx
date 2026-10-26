import React, { useReducer, useMemo, useEffect, useRef } from 'react';
import { cartReducer, initialCartState } from './cartReducer';
import { CartContext } from './useCart';
import type { CartContextType } from './useCart';
import {
  CART_STORAGE_KEY,
  getInitialCartState,
  saveCart,
  loadCart,
  clearStoredCart,
} from './cartStorage';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lazily initialize cart state from localStorage synchronously on first mount
  const [state, dispatch] = useReducer(cartReducer, initialCartState, getInitialCartState);
  const isFirstMount = useRef(true);

  // Synchronize cart changes to localStorage
  useEffect(() => {
    // Avoid double writing the freshly loaded state on initial mount
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (state.items.length === 0) {
      clearStoredCart();
    } else {
      saveCart(state.items);
    }
  }, [state.items]);

  // Synchronize across browser tabs/windows if cart is modified elsewhere
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) {
        const refreshedItems = loadCart();
        dispatch({ type: 'RESTORE_CART', payload: { items: refreshedItems } });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const contextValue = useMemo<CartContextType>(() => {
    return {
      state,
      items: state.items,
      totalQuantity: state.totalQuantity,
      subtotalUsd: state.subtotalUsd,
      totalPriceUsd: state.totalPriceUsd,
      totalPriceKhr: state.totalPriceKhr,
      addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
      removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } }),
      increaseQuantity: (id) => dispatch({ type: 'INCREASE_QUANTITY', payload: { id } }),
      decreaseQuantity: (id) => dispatch({ type: 'DECREASE_QUANTITY', payload: { id } }),
      updateQuantity: (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
      clearCart: () => {
        clearStoredCart();
        dispatch({ type: 'CLEAR_CART' });
      },
    };
  }, [state]);

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
