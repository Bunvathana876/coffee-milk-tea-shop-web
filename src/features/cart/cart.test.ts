import test from 'node:test';
import assert from 'node:assert/strict';

// Mock browser window and localStorage for Node testing environment
const storageMock = new Map<string, string>();
const fakeWindow = {
  localStorage: {
    getItem: (k: string) => storageMock.get(k) ?? null,
    setItem: (k: string, v: string) => storageMock.set(k, String(v)),
    removeItem: (k: string) => storageMock.delete(k),
    clear: () => storageMock.clear(),
  },
};
(globalThis as any).window = fakeWindow;

import {
  loadCart,
  saveCart,
  clearStoredCart,
  isValidCartItem,
  CART_STORAGE_KEY,
} from './cartStorage.ts';
import { cartReducer, initialCartState } from './cartReducer.ts';
import { calculateCustomizedPrice } from '../products/customization.ts';
import { usdToKhr, formatUsd, formatKhr } from '../../config/currency.ts';
import type { CartItem } from '../../types/index.ts';

test('1. Customization and Price Calculations', () => {
  // Base price $2.50
  // Small: $2.50 + $0.00 = $2.50
  const small = calculateCustomizedPrice(2.5, 'Small', 1);
  assert.equal(small.unitPrice, 2.5);
  assert.equal(small.subtotal, 2.5);

  // Medium: $2.50 + $0.30 = $2.80, quantity 2 = $5.60
  const medium = calculateCustomizedPrice(2.5, 'Medium', 2);
  assert.equal(medium.unitPrice, 2.8);
  assert.equal(medium.subtotal, 5.6);

  // Large: $2.50 + $0.60 = $3.10, quantity 3 = $9.30
  const large = calculateCustomizedPrice(2.5, 'Large', 3);
  assert.equal(large.unitPrice, 3.1);
  assert.equal(large.subtotal, 9.3);
});

test('2. Dual Currency Formatting & Exchange Rate', () => {
  assert.equal(formatUsd(8.2), '$8.20');
  assert.equal(usdToKhr(8.2), 33620);
  assert.equal(formatKhr(8.2), '៛33,620');
});

test('3. Cart Reducer: Add Item & Add Another Customization of Same Drink', () => {
  let state = initialCartState;

  // Add Item 1: Classic Iced Latte, Medium, 50% sugar, Normal Ice, Qty 1
  state = cartReducer(state, {
    type: 'ADD_ITEM',
    payload: {
      productId: 1,
      productName: 'Classic Iced Latte',
      image: null,
      size: 'Medium',
      sugarLevel: '50%',
      iceLevel: 'Normal Ice',
      unitPriceUsd: 2.8,
      quantity: 1,
    },
  });

  assert.equal(state.items.length, 1);
  assert.equal(state.totalQuantity, 1);
  assert.equal(state.totalPriceUsd, 2.8);

  // Add Item 2: Same drink, but DIFFERENT customization (Large, 100% sugar, Less Ice)
  state = cartReducer(state, {
    type: 'ADD_ITEM',
    payload: {
      productId: 1,
      productName: 'Classic Iced Latte',
      image: null,
      size: 'Large',
      sugarLevel: '100%',
      iceLevel: 'Less Ice',
      unitPriceUsd: 3.1,
      quantity: 1,
    },
  });

  // Must be stored as 2 separate items
  assert.equal(state.items.length, 2);
  assert.equal(state.totalQuantity, 2);
  assert.equal(state.totalPriceUsd, 5.9);

  // Add Item 3: Exact same customization as Item 1 -> must increment quantity of Item 1
  state = cartReducer(state, {
    type: 'ADD_ITEM',
    payload: {
      productId: 1,
      productName: 'Classic Iced Latte',
      image: null,
      size: 'Medium',
      sugarLevel: '50%',
      iceLevel: 'Normal Ice',
      unitPriceUsd: 2.8,
      quantity: 2,
    },
  });

  assert.equal(state.items.length, 2);
  assert.equal(state.totalQuantity, 4);
  assert.equal(state.items[0].quantity, 3);
});

test('4. Cart Reducer: Quantity Change and Item Removal', () => {
  let state = initialCartState;
  state = cartReducer(state, {
    type: 'ADD_ITEM',
    payload: {
      productId: 1,
      productName: 'Latte',
      image: null,
      size: 'Medium',
      sugarLevel: '50%',
      iceLevel: 'Normal Ice',
      unitPriceUsd: 2.8,
      quantity: 1,
    },
  });

  const itemId = state.items[0].id;

  // Increase quantity
  state = cartReducer(state, { type: 'INCREASE_QUANTITY', payload: { id: itemId } });
  assert.equal(state.items[0].quantity, 2);
  assert.equal(state.totalPriceUsd, 5.6);

  // Decrease quantity
  state = cartReducer(state, { type: 'DECREASE_QUANTITY', payload: { id: itemId } });
  assert.equal(state.items[0].quantity, 1);
  assert.equal(state.totalPriceUsd, 2.8);

  // Decrease quantity from 1 removes item
  state = cartReducer(state, { type: 'DECREASE_QUANTITY', payload: { id: itemId } });
  assert.equal(state.items.length, 0);
  assert.equal(state.totalQuantity, 0);
  assert.equal(state.totalPriceUsd, 0);
});

test('5. LocalStorage Persistence and Refresh Simulation', () => {
  fakeWindow.localStorage.clear();

  const sampleItems: CartItem[] = [
    {
      id: '1-medium-50%-normal-ice',
      productId: 1,
      productName: 'Brown Sugar Boba',
      image: null,
      size: 'Medium',
      sugarLevel: '50%',
      iceLevel: 'Normal Ice',
      unitPriceUsd: 3.5,
      quantity: 2,
      subtotalUsd: 7.0,
    },
  ];

  saveCart(sampleItems);
  assert.ok(storageMock.has(CART_STORAGE_KEY));

  // Simulate refresh by calling loadCart()
  const loaded = loadCart();
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].productName, 'Brown Sugar Boba');
  assert.equal(loaded[0].quantity, 2);
  assert.equal(loaded[0].subtotalUsd, 7.0);

  // Clear stored cart
  clearStoredCart();
  assert.equal(loadCart().length, 0);
});

test('6. Corrupted LocalStorage Handling & Safe Recovery', () => {
  // Test case A: Syntax error (malformed JSON string)
  storageMock.set(CART_STORAGE_KEY, '{invalid-json: corrupted');
  let recovered = loadCart();
  assert.deepEqual(recovered, [], 'Must return empty array on syntax error');
  assert.equal(storageMock.has(CART_STORAGE_KEY), false, 'Corrupted key must be cleared');

  // Test case B: Corrupted structure (not array or invalid objects)
  storageMock.set(CART_STORAGE_KEY, JSON.stringify({ random: 'object without items' }));
  recovered = loadCart();
  assert.deepEqual(recovered, [], 'Must return empty array on unexpected structure');

  // Test case C: Array with corrupted items (missing required fields, negative prices, NaN)
  const corruptedList = [
    { id: 'item-1', productId: 'not-a-number' },
    { id: 'item-2', productId: 1, quantity: -5 },
    { id: 'item-3', productId: 1, unitPriceUsd: -10 },
    null,
    'garbage-string',
  ];
  storageMock.set(CART_STORAGE_KEY, JSON.stringify(corruptedList));
  recovered = loadCart();
  assert.deepEqual(recovered, [], 'All invalid/corrupted items must be rejected');

  // Test case D: Validation helper unit checks
  assert.equal(isValidCartItem(null), false);
  assert.equal(isValidCartItem({}), false);
  assert.equal(isValidCartItem({ id: '', productId: 1 }), false);
  assert.equal(isValidCartItem({ id: '1', productId: 1, quantity: 0 }), false);
});
