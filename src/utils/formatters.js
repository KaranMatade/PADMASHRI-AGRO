/**
 * formatters.js — Display formatting utilities
 * Author: Anushka Shete
 * For formatting phone numbers, dates, currency for UI display
 */

/**
 * Format Indian mobile number for display
 * e.g. 9876543210 → +91 98765 43210
 * @param {string} phone
 * @returns {string}
 */
export function formatIndianPhone(phone) {
  if (!phone) return '';
  const clean = String(phone).replace(/\D/g, '').replace(/^91/, '');
  if (clean.length !== 10) return phone;
  return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
}

/**
 * Format a date string to Indian locale display
 * e.g. "2026-09-10T15:30:00" → "10 Sep 2026, 3:30 PM"
 * @param {string} dateStr
 * @param {string} lang - 'en' or 'mr'
 * @returns {string}
 */
export function formatDate(dateStr, lang = 'en') {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const locale = lang === 'mr' ? 'mr-IN' : 'en-IN';
    return date.toLocaleString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format price in Indian Rupees
 * e.g. 250000 → "₹2,50,000"
 * @param {number} amount
 * @returns {string}
 */
export function formatRupees(amount) {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Truncate text to a max length with ellipsis
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
export function truncate(text, maxLen = 80) {
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen).trimEnd() + '…' : text;
}
