// Shared pricing constants and helpers used by CloudPricingCalculator and EstimateDetailsModal

// Currency symbols (static - these don't change)
export const CURRENCIES = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }

// Default values (used as fallback when API settings not yet loaded)
const DEFAULT_CURRENCY_RATES = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 }
const DEFAULT_BILLING_DISCOUNTS = { yearly: 0.9, 'bi-annually': 0.85, 'tri-annually': 0.8 }

// Active settings (updated from API via applyPricingSettings)
let activeCurrencyRates = { ...DEFAULT_CURRENCY_RATES }
let activeBillingDiscounts = { ...DEFAULT_BILLING_DISCOUNTS }
let activeGstRate = 18

/**
 * Apply dynamic pricing settings fetched from API.
 * Call this once when apiData loads in CloudPricingCalculator.
 */
export function applyPricingSettings(settings) {
  if (!settings) return
  if (settings.currency_rates) {
    activeCurrencyRates = { ...DEFAULT_CURRENCY_RATES, ...settings.currency_rates }
  }
  if (settings.billing_discounts) {
    activeBillingDiscounts = { ...DEFAULT_BILLING_DISCOUNTS, ...settings.billing_discounts }
  }
  if (settings.gst_rate !== undefined && settings.gst_rate !== null) {
    activeGstRate = settings.gst_rate
  }
}

export function getGstRate() {
  return activeGstRate / 100 // Convert percentage to decimal (18 → 0.18)
}

export function getGstPercent() {
  return activeGstRate // Returns the percentage number (18)
}

export function getCurrencyRates() {
  return activeCurrencyRates
}

export function getBillingDiscounts() {
  return activeBillingDiscounts
}

function buildBillingCycles() {
  return [
    { id: 'hourly', label: 'Hourly', multiplier: 1/730, suffix: '/hour' },
    { id: 'monthly', label: 'Monthly', multiplier: 1, suffix: '/month' },
    { id: 'quarterly', label: 'Quarterly', multiplier: 3, suffix: '/quarter' },
    { id: 'semi-annually', label: 'Semi-Annually', multiplier: 6, suffix: '/6 months' },
    { id: 'yearly', label: 'Yearly', multiplier: 12, suffix: '/year', discount: activeBillingDiscounts['yearly'] || 0.9 },
    { id: 'bi-annually', label: 'Bi-Annually', multiplier: 24, suffix: '/2 years', discount: activeBillingDiscounts['bi-annually'] || 0.85 },
    { id: 'tri-annually', label: 'Tri-Annually', multiplier: 36, suffix: '/3 years', discount: activeBillingDiscounts['tri-annually'] || 0.8 },
  ]
}

// BILLING_CYCLES exported for backward compatibility (reads active discounts dynamically)
export const BILLING_CYCLES = buildBillingCycles()

export const getBillingCycle = (id) => {
  const cycles = buildBillingCycles()
  return cycles.find(c => c.id === id) || cycles[1]
}

export const getPriceForCycle = (monthlyPrice, cycleId) => {
  const cycle = getBillingCycle(cycleId)
  return monthlyPrice * cycle.multiplier * (cycle.discount || 1)
}

export const formatPrice = (amount, currency = 'INR') => {
  if (!amount || isNaN(amount)) return `${CURRENCIES[currency] || '₹'}0.00`
  const rate = activeCurrencyRates[currency] || 1
  const converted = amount * rate
  return `${CURRENCIES[currency] || '₹'}${converted.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const formatMemory = (mb) => {
  if (!mb) return '0 GB'
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`
}
