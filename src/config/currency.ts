/**
 * Currency configuration and exchange rate utilities for Brew & Boba Café.
 *
 * Rules:
 * 1. USD is always the single source of truth for all base prices and subtotals.
 * 2. KHR is dynamically derived from USD using the configurable exchange rate USD_TO_KHR.
 * 3. Never hardcode 4100 or independent KHR values throughout the application.
 */

// Configurable exchange rate (can be customized via environment variable VITE_USD_TO_KHR)
export const USD_TO_KHR: number = Number(import.meta.env.VITE_USD_TO_KHR) || 4100;

export const CURRENCY_SYMBOLS = {
  USD: '$',
  KHR: '៛',
} as const;

/**
 * Converts a USD amount to Cambodian Riel (KHR) based on the configurable exchange rate.
 * Rounds to the nearest whole Riel.
 *
 * Example:
 *   usdToKhr(3.50) => 14350
 *   usdToKhr(8.50) => 34850
 */
export function usdToKhr(amountUsd: number, rate: number = USD_TO_KHR): number {
  if (isNaN(amountUsd) || amountUsd < 0) return 0;
  return Math.round(amountUsd * rate);
}

/**
 * Formats a USD amount with standard two decimal places and a dollar sign.
 *
 * Example:
 *   formatUsd(3.5) => "$3.50"
 *   formatUsd(8.5) => "$8.50"
 */
export function formatUsd(amount: number): string {
  if (isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats an amount into Cambodian Riel (KHR) prefixed with ៛ and formatted with commas.
 * By default, converts from the source USD price.
 *
 * Example:
 *   formatKhr(3.50) => "៛14,350"
 *   formatKhr(8.50) => "៛34,850"
 *   formatKhr(34850, { isDirectKhr: true }) => "៛34,850"
 */
export function formatKhr(
  amount: number,
  options?: { isDirectKhr?: boolean; rate?: number }
): string {
  if (isNaN(amount)) return '៛0';
  const khr = options?.isDirectKhr
    ? Math.round(amount)
    : usdToKhr(amount, options?.rate ?? USD_TO_KHR);

  return `៛${new Intl.NumberFormat('en-US').format(khr)}`;
}

// Aliases for convenience and backward-compatibility
export const formatUSD = formatUsd;
export const formatKHR = formatKhr;
export const toKHR = usdToKhr;
export const KHR_EXCHANGE_RATE = USD_TO_KHR;

