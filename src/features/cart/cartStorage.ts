import type { CartItem, CartState } from '../../types';
import { calculateCartTotals, calculateItemSubtotal } from './cartUtils';

export const CART_STORAGE_KEY = 'brew_boba_cart_v1';

/**
 * Validates whether an arbitrary item conforms to the CartItem contract.
 * Protects the application from crashing on corrupted, modified, or outdated localStorage schemas.
 */
export function isValidCartItem(item: unknown): item is CartItem {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const candidate = item as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    candidate.id.trim().length > 0 &&
    typeof candidate.productId === 'number' &&
    !Number.isNaN(candidate.productId) &&
    typeof candidate.productName === 'string' &&
    candidate.productName.trim().length > 0 &&
    typeof candidate.size === 'string' &&
    typeof candidate.sugarLevel === 'string' &&
    typeof candidate.iceLevel === 'string' &&
    typeof candidate.unitPriceUsd === 'number' &&
    !Number.isNaN(candidate.unitPriceUsd) &&
    candidate.unitPriceUsd >= 0 &&
    typeof candidate.quantity === 'number' &&
    !Number.isNaN(candidate.quantity) &&
    candidate.quantity > 0
  );
}

/**
 * Saves the shopping cart items to browser localStorage.
 * Accepts either an array of CartItem or the full CartState.
 * Fails gracefully without throwing errors if localStorage is restricted (e.g. private browsing mode).
 */
export function saveCart(cart: CartItem[] | CartState): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    const items = Array.isArray(cart) ? cart : cart.items;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error);
  }
}

/**
 * Loads and validates cart items from browser localStorage.
 * If data is missing, invalid, or corrupted, resets safely and returns an empty array.
 */
export function loadCart(): CartItem[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }

    const rawData = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!rawData) {
      return [];
    }

    const parsed = JSON.parse(rawData);

    // Support either an array of items or an object with an items property
    const rawItems: unknown[] | null = Array.isArray(parsed)
      ? parsed
      : (parsed && typeof parsed === 'object' && Array.isArray((parsed as { items?: unknown }).items)
        ? (parsed as { items: unknown[] }).items
        : null);

    if (!rawItems) {
      console.warn('Invalid cart structure in localStorage. Clearing.');
      clearStoredCart();
      return [];
    }

    const validItems: CartItem[] = [];
    for (const item of rawItems) {
      if (isValidCartItem(item)) {
        const cleanQuantity = Math.max(1, Math.floor(item.quantity));
        validItems.push({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          image: item.image || null,
          size: item.size,
          sugarLevel: item.sugarLevel,
          iceLevel: item.iceLevel,
          unitPriceUsd: item.unitPriceUsd,
          quantity: cleanQuantity,
          subtotalUsd: calculateItemSubtotal(item.unitPriceUsd, cleanQuantity),
        });
      }
    }

    return validItems;
  } catch (error) {
    console.warn('Corrupted cart found in localStorage, clearing corrupted data:', error);
    clearStoredCart();
    return [];
  }
}

/**
 * Clears stored cart data from browser localStorage.
 * Fails gracefully if localStorage is unavailable.
 */
export function clearStoredCart(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear cart from localStorage:', error);
  }
}

/**
 * Computes the initial cart state for CartProvider.
 * Restores stored items if available, or returns a fresh empty state.
 */
export function getInitialCartState(): CartState {
  const loadedItems = loadCart();
  if (loadedItems.length === 0) {
    return {
      items: [],
      totalQuantity: 0,
      subtotalUsd: 0,
      totalPriceUsd: 0,
      totalPriceKhr: 0,
    };
  }

  return {
    items: loadedItems,
    ...calculateCartTotals(loadedItems),
  };
}

