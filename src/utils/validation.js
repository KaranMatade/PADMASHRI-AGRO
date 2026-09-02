/**
 * Form validation utilities for Padmashri Agro Services
 * Provides validation functions for inquiry forms and user inputs
 */

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
