/**
 * Shared price formatting and parsing utilities.
 * Single source of truth — use these instead of defining local versions.
 */

/**
 * Parse a price string/number into a numeric value.
 * Handles: numbers, "₹1,200", "1200", "N/A", "Contact Sales", null, undefined
 * @param {string|number} priceStr
 * @returns {number} Parsed numeric price, or 0 if unparseable
 */
export const parsePrice = (priceStr) => {
  if (!priceStr || priceStr === 'N/A' || priceStr === 'Contact Sales') return 0;
  const cleaned = String(priceStr).replace(/[₹,\s]/g, '');
  return isNaN(parseFloat(cleaned)) ? 0 : parseFloat(cleaned);
};

/**
 * Format a numeric price for display in INR.
 * @param {number} price
 * @returns {string} e.g. "₹1,200" or "₹0"
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price || 0);
};

/**
 * Format a price that might be "N/A" or "Contact Sales".
 * Falls back to "Contact Sales" for invalid/missing prices.
 * @param {string|number} price
 * @returns {string}
 */
export const formatPriceOrContact = (price) => {
  if (!price || price === 'N/A' || price === 'Contact Sales') return 'Contact Sales';
  const num = parsePrice(price);
  if (num === 0) return 'Contact Sales';
  return formatPrice(num);
};

/**
 * All supported billing durations.
 */
export const DURATIONS = [
  { value: 'hourly', label: 'Hourly', suffix: '/hour' },
  { value: 'monthly', label: 'Monthly', suffix: '/month' },
  { value: 'quarterly', label: 'Quarterly', suffix: '/quarter' },
  { value: 'semi-annually', label: 'Semi-Annually', suffix: '/6 months' },
  { value: 'yearly', label: 'Yearly', suffix: '/year' },
  { value: 'bi-annually', label: 'Bi-Annually', suffix: '/2 years' },
  { value: 'tri-annually', label: 'Tri-Annually', suffix: '/3 years' },
];

/**
 * Multipliers to convert a price at a given duration INTO its monthly equivalent.
 * e.g. hourly price × 730 = monthly, quarterly price × (1/3) = monthly
 */
export const DURATION_TO_MONTHLY = {
  hourly: 730,
  monthly: 1,
  quarterly: 1 / 3,
  'semi-annually': 1 / 6,
  yearly: 1 / 12,
  'bi-annually': 1 / 24,
  'tri-annually': 1 / 36,
};
