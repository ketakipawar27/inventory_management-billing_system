
/**
 * Formats a number as Indian Rupee (INR) currency.
 * Follows the Indian numbering system (e.g., 1,00,000 instead of 100,000).
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Helper to join class names conditionally.
 */
export const cn = (...classes: (string | undefined | false | null)[]) => {
  return classes.filter(Boolean).join(' ');
};
