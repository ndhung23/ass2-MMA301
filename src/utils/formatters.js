// Utility functions for formatting values

/**
 * Format a number as USD currency ($xx.xx)
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
  return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Calculate the original price given the discounted price and discount percentage
 */
export const calculateOriginalPrice = (discountedPrice, discountPercentage) => {
  if (!discountedPrice || !discountPercentage) return discountedPrice;
  return discountedPrice / (1 - discountPercentage / 100);
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate long text with ellipsis
 */
export const truncateText = (text, maxLength = 60) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
