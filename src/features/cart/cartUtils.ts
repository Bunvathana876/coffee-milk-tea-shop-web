import type { CartItem, DrinkSize, SugarLevel, IceLevel } from '../../types';
import { usdToKhr } from '../../config/currency';

/**
 * Creates a unique identifier for a cart item based on its product ID and unique customizations.
 * Two drinks of the same product with different sizes, sugar levels, or ice levels
 * will receive distinct IDs and be treated as separate cart items.
 */
export function generateCartItemId(
  productId: number,
  size: DrinkSize,
  sugarLevel: SugarLevel,
  iceLevel: IceLevel,
  toppings: string[] = []
): string {
  const sortedToppings = [...toppings].sort().join(',');
  const toppingsPart = sortedToppings ? `-${sortedToppings}` : '';
  return `${productId}-${size}-${sugarLevel}-${iceLevel}${toppingsPart}`.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Calculates item subtotal given unit price and quantity.
 */
export function calculateItemSubtotal(unitPriceUsd: number, quantity: number): number {
  return Number((unitPriceUsd * quantity).toFixed(2));
}

/**
 * Calculates aggregates across all items in the cart:
 * - totalQuantity (sum of all units)
 * - subtotalUsd (sum of item subtotals in USD)
 * - totalPriceUsd (final total price in USD)
 * - totalPriceKhr (converted into Cambodian Riel from USD via usdToKhr)
 */
export function calculateCartTotals(items: CartItem[]) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalUsd = Number(
    items.reduce((sum, item) => sum + item.subtotalUsd, 0).toFixed(2)
  );
  const totalPriceUsd = subtotalUsd;
  const totalPriceKhr = usdToKhr(totalPriceUsd);

  return {
    totalQuantity,
    subtotalUsd,
    totalPriceUsd,
    totalPriceKhr,
  };
}

