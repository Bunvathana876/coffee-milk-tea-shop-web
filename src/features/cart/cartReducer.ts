import type { CartState, CartAction, CartItem } from '../../types';
import { generateCartItemId, calculateItemSubtotal, calculateCartTotals } from './cartUtils';

export const initialCartState: CartState = {
  items: [],
  totalQuantity: 0,
  subtotalUsd: 0,
  totalPriceUsd: 0,
  totalPriceKhr: 0,
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, productName, image, size, sugarLevel, iceLevel, toppings = [], unitPriceUsd, quantity } = action.payload;
      const itemId = generateCartItemId(productId, size, sugarLevel, iceLevel, toppings);

      const existingIndex = state.items.findIndex((item) => item.id === itemId);

      let updatedItems: CartItem[];

      if (existingIndex > -1) {
        // Item with exact customization exists: increment quantity
        updatedItems = state.items.map((item, index) => {
          if (index === existingIndex) {
            const newQuantity = item.quantity + quantity;
            return {
              ...item,
              quantity: newQuantity,
              subtotalUsd: calculateItemSubtotal(item.unitPriceUsd, newQuantity),
            };
          }
          return item;
        });
      } else {
        // New item or different customization: add as separate entry
        const newItem: CartItem = {
          id: itemId,
          productId,
          productName,
          image,
          size,
          sugarLevel,
          iceLevel,
          toppings,
          unitPriceUsd,
          quantity,
          subtotalUsd: calculateItemSubtotal(unitPriceUsd, quantity),
        };
        updatedItems = [...state.items, newItem];
      }

      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter((item) => item.id !== action.payload.id);
      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
      };
    }

    case 'INCREASE_QUANTITY': {
      const updatedItems = state.items.map((item) => {
        if (item.id === action.payload.id) {
          const newQuantity = item.quantity + 1;
          return {
            ...item,
            quantity: newQuantity,
            subtotalUsd: calculateItemSubtotal(item.unitPriceUsd, newQuantity),
          };
        }
        return item;
      });

      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
      };
    }

    case 'DECREASE_QUANTITY': {
      const targetItem = state.items.find((item) => item.id === action.payload.id);
      if (!targetItem) return state;

      let updatedItems: CartItem[];
      if (targetItem.quantity <= 1) {
        // Remove item if decreasing from 1
        updatedItems = state.items.filter((item) => item.id !== action.payload.id);
      } else {
        updatedItems = state.items.map((item) => {
          if (item.id === action.payload.id) {
            const newQuantity = item.quantity - 1;
            return {
              ...item,
              quantity: newQuantity,
              subtotalUsd: calculateItemSubtotal(item.unitPriceUsd, newQuantity),
            };
          }
          return item;
        });
      }

      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;

      let updatedItems: CartItem[];
      if (quantity <= 0) {
        updatedItems = state.items.filter((item) => item.id !== id);
      } else {
        updatedItems = state.items.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              quantity,
              subtotalUsd: calculateItemSubtotal(item.unitPriceUsd, quantity),
            };
          }
          return item;
        });
      }

      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
      };
    }

    case 'RESTORE_CART': {
      const items = action.payload.items;
      return {
        ...state,
        items,
        ...calculateCartTotals(items),
      };
    }

    case 'CLEAR_CART':
      return initialCartState;

    default:
      return state;
  }
}

