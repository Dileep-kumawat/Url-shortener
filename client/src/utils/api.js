/**
 * utils/api.js — API client for the URL shortener backend
 */

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const shortenUrl = async (payload) => {
  const res = await fetch(`${BASE}/api/shorten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const fetchStats = async (code) => {
  const res = await fetch(`${BASE}/api/stats/${code}`);
  return res.json();
};
