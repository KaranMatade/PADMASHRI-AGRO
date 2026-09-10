// useFetch.js — Custom hook for API data fetching
// Author: Anushka Shete
// Reusable hook for all backend API calls with loading/error state

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom React hook to fetch data from a URL
 * Handles loading state, error state, and refetch capability
 * 
 * @param {string} url - API endpoint to fetch
 * @param {RequestInit} options - Optional fetch options
 * @returns {{ data, loading, error, refetch }}
 */
export default function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
