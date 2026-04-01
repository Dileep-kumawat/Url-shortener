/**
 * hooks/useLocalHistory.js — Persists recent shortened URLs in localStorage
 */
import { useState, useCallback } from "react";

const STORAGE_KEY = "snip_recent_urls";
const MAX_HISTORY = 10;

const loadHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveHistory = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage might be full — silently ignore
  }
};

const useLocalHistory = () => {
  const [history, setHistory] = useState(loadHistory);

  /** Add a new shortened URL entry to history (newest first, deduplicated) */
  const addToHistory = useCallback((entry) => {
    setHistory((prev) => {
      // Remove existing entry with same shortCode if present
      const filtered = prev.filter((h) => h.shortCode !== entry.shortCode);
      const updated = [entry, ...filtered].slice(0, MAX_HISTORY);
      saveHistory(updated);
      return updated;
    });
  }, []);

  /** Remove a single entry by shortCode */
  const removeFromHistory = useCallback((shortCode) => {
    setHistory((prev) => {
      const updated = prev.filter((h) => h.shortCode !== shortCode);
      saveHistory(updated);
      return updated;
    });
  }, []);

  /** Clear all history */
  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory };
};

export default useLocalHistory;
