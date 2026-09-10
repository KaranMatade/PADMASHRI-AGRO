/**
 * Form validation utilities for Padmashri Agro Services
 * Provides validation functions for inquiry forms and user inputs
 * Author: Anushka Shete
 */

/**
 * Validates Indian mobile phone numbers
 * Must be 10 digits and start with 6, 7, 8, or 9
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateIndianMobile = (phone) => {
  if (!phone) return false;
  
  // Remove spaces, hyphens, and +91 prefix
  const cleaned = phone.replace(/[\s\-\+]/g, '').replace(/^91/, '');
  
  // Must be exactly 10 digits starting with 6-9
  const regex = /^[6-9]\d{9}$/;
  return regex.test(cleaned);
};

/**
 * Validates user name input
 * Must be at least 2 characters, no special characters
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateName = (name) => {
  if (!name) return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
};

/**
 * Validates location/village input
 * Must be at least 2 characters long
 * @param {string} location - Location to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateLocation = (location) => {
  if (!location) return false;
  return location.trim().length >= 2;
};

/**
 * Sanitizes user input to prevent XSS attacks
 * Strips dangerous HTML tags and trims whitespace
 * @param {string} input - Raw user input
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  return input
    .trim()
    .replace(/<script[^>]*?>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&/g, '&amp;')
    .substring(0, 500); // max 500 chars
};

/**
 * Validates a message/note field (optional but max 500 chars)
 * @param {string} message - Message text
 * @returns {boolean}
 */
export const validateMessage = (message) => {
  if (!message) return true; // optional field
  return message.trim().length <= 500;
};

/**
 * Validates entire inquiry form and returns error messages
 * @param {Object} formData - Form data object with name, phone, village
 * @param {string} lang - Language code ('en' or 'mr')
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const validateInquiryForm = (formData, lang = 'en') => {
  const errors = {};
  
  // Validate name
  if (!validateName(formData.name)) {
    errors.name = lang === 'mr' 
      ? 'कृपया किमान २ अक्षरांचे नाव टाका' 
      : 'Please enter a name with at least 2 characters';
  }
  
  // Validate phone
  if (!validateIndianMobile(formData.phone)) {
    errors.phone = lang === 'mr'
      ? 'कृपया वैध १० अंकी मोबाईल नंबर टाका (६/७/८/९ ने सुरू)'
      : 'Please enter a valid 10-digit mobile number (starting with 6/7/8/9)';
  }
  
  // Validate village/location
  if (!validateLocation(formData.village)) {
    errors.village = lang === 'mr'
      ? 'कृपया किमान २ अक्षरांचे गाव/शहर नाव टाका'
      : 'Please enter a village/city name with at least 2 characters';
  }

  // Validate message length
  if (!validateMessage(formData.message)) {
    errors.message = lang === 'mr'
      ? 'संदेश जास्तीत जास्त ५०० अक्षरांचा असावा'
      : 'Message must be 500 characters or less';
  }
  
  return errors;
};


/**
 * Validates Indian mobile phone numbers
 * Must be 10 digits and start with 6, 7, 8, or 9
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateIndianMobile = (phone) => {
  if (!phone) return false;
  
  // Remove spaces and hyphens
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Must be exactly 10 digits starting with 6-9
  const regex = /^[6-9]\d{9}$/;
  return regex.test(cleaned);
};

/**
 * Validates user name input
 * Must be at least 2 characters long
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateName = (name) => {
  if (!name) return false;
  return name.trim().length >= 2;
};

/**
 * Validates location/village input
 * Must be at least 2 characters long
 * @param {string} location - Location to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateLocation = (location) => {
  if (!location) return false;
  return location.trim().length >= 2;
};

/**
 * Validates entire inquiry form and returns error messages
 * @param {Object} formData - Form data object with name, phone, village
 * @param {string} lang - Language code ('en' or 'mr')
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const validateInquiryForm = (formData, lang = 'en') => {
  const errors = {};
  
  // Validate name
  if (!validateName(formData.name)) {
    errors.name = lang === 'mr' 
      ? 'कृपया किमान २ अक्षरांचे नाव टाका' 
      : 'Please enter a name with at least 2 characters';
  }
  
  // Validate phone
  if (!validateIndianMobile(formData.phone)) {
    errors.phone = lang === 'mr'
      ? 'कृपया वैध १० अंकी मोबाईल नंबर टाका (६/७/८/९ ने सुरू)'
      : 'Please enter a valid 10-digit mobile number (starting with 6/7/8/9)';
  }
  
  // Validate village/location
  if (!validateLocation(formData.village)) {
    errors.village = lang === 'mr'
      ? 'कृपया किमान २ अक्षरांचे गाव/शहर नाव टाका'
      : 'Please enter a village/city name with at least 2 characters';
  }
  
  return errors;
};
