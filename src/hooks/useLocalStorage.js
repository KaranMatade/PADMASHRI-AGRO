/**
 * useLocalStorage.js — Custom hook for persisting values in browser localStorage
 * Author: Anushka Shete
 * Used for saving user preferences like language, theme, recent inquiry ref
 */

import { useState } from 'react';

/**
 * useLocalStorage - Drop-in replacement for useState that persists to localStorage
 * @param {string} key - localStorage key
 * @param {any} initialValue - default value if key not present
 * @returns [storedValue, setValue]
 */
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.warn(`[useLocalStorage] Could not save key "${key}":`, err);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch { /* silent */ }
  };

  return [storedValue, setValue, removeValue];
}
