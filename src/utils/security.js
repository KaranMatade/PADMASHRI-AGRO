/**
 * Security utilities for Padmashri Agro Services
 * Provides helpers for secure external link handling
 */

/**
 * Sanitizes external link attributes to prevent security vulnerabilities
 * Ensures all external links include proper rel attributes
 * @param {string} href - URL to link to
 * @returns {Object} - Object with href, target, and rel attributes
 */
export const sanitizeExternalLink = (href) => {
  return {
    href,
    target: '_blank',
    rel: 'noopener noreferrer'
  };
};

/**
 * Validates that an anchor element has proper security attributes
 * Checks for presence of noopener and noreferrer in rel attribute
 * @param {HTMLAnchorElement} anchorElement - Anchor element to validate
 * @returns {boolean} - True if secure, false otherwise
 */
export const isSecureExternalLink = (anchorElement) => {
  if (!anchorElement || anchorElement.target !== '_blank') {
    return true; // Not an external link
  }
  
  const rel = anchorElement.getAttribute('rel') || '';
  const relValues = rel.split(' ');
  
  return relValues.includes('noopener') && relValues.includes('noreferrer');
};
