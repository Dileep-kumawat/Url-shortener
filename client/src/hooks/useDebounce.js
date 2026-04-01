/**
 * hooks/useDebounce.js — Debounce any rapidly-changing value
 */
import { useState, useEffect } from "react";

/**
 * Returns a debounced version of `value` that only updates
 * after `delay` ms of silence.
 * @param {any} value
 * @param {number} delay — milliseconds (default 450)
 */
const useDebounce = (value, delay = 450) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
