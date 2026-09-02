import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting state to localStorage
 * Automatically syncs state with localStorage on changes
 * Handles errors gracefully and falls back to in-memory state
 * 
 * @param {string} key - localStorage key to use
 * @param {any} defaultValue - Default value if no stored value exists
 * @returns {[any, Function]} - Tuple of [value, setValue] like useState
 */
function useLocalStorage(key, defaultValue) {
  // Initialize state with value from localStorage or default
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Update localStorage whenever value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Handle quota exceeded errors, security errors, etc.
      if (error.name === 'QuotaExceededError') {
        console.error(`localStorage quota exceeded for key "${key}"`);
      } else if (error.name === 'SecurityError') {
        console.error(`localStorage access denied for key "${key}"`);
      } else {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
