import type { DrinkSize, SugarLevel, IceLevel } from '../../types';

export interface SizeOption {
  value: DrinkSize;
  label: string;
  priceAdjustment: number;
  description: string;
}

export const SIZE_OPTIONS: SizeOption[] = [
  { value: 'Small', label: 'Small', priceAdjustment: 0.0, description: '12 oz (350ml)' },
  { value: 'Medium', label: 'Medium', priceAdjustment: 0.3, description: '16 oz (500ml)' },
  { value: 'Large', label: 'Large', priceAdjustment: 0.6, description: '22 oz (650ml)' },
];

export const SUGAR_OPTIONS: SugarLevel[] = ['0%', '25%', '50%', '75%', '100%'];

export const ICE_OPTIONS: IceLevel[] = ['No Ice', 'Less Ice', 'Normal Ice', 'Extra Ice'];

export interface ToppingOption {
  id: string;
  name: string;
  price: number;
}

export const TOPPING_OPTIONS: ToppingOption[] = [
  { id: 'brown-sugar-pearls', name: 'Brown Sugar Pearls', price: 0.50 },
  { id: 'cheese-foam', name: 'Cheese Foam', price: 0.60 },
  { id: 'coconut-jelly', name: 'Coconut Jelly', price: 0.40 },
  { id: 'pudding', name: 'Pudding', price: 0.50 },
];

export function calculateCustomizedPrice(
  basePrice: number,
  size: DrinkSize,
  quantity: number = 1,
  toppings: string[] = []
) {
  const sizeObj = SIZE_OPTIONS.find((s) => s.value === size) ?? SIZE_OPTIONS[1];
  const toppingsPrice = toppings.reduce((sum, toppingName) => {
    const found = TOPPING_OPTIONS.find(
      (t) => t.name.toLowerCase() === toppingName.toLowerCase() || t.id === toppingName
    );
    return sum + (found ? found.price : 0);
  }, 0);

  const unitPrice = Number((basePrice + sizeObj.priceAdjustment + toppingsPrice).toFixed(2));
  const subtotal = Number((unitPrice * quantity).toFixed(2));
  return { unitPrice, subtotal, priceAdjustment: sizeObj.priceAdjustment, toppingsPrice };
}

