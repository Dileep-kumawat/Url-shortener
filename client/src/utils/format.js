/**
 * utils/format.js — Date and number formatting helpers
 */

/** Relative time (e.g. "3 minutes ago", "2 days ago") */
export const timeAgo = (dateStr) => {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

/** Formats a full date like "Apr 5, 2025 · 14:32" */
export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/** Truncates a URL for display */
export const truncateUrl = (url, maxLen = 48) => {
  if (!url) return "";
  try {
    const { hostname, pathname } = new URL(url);
    const path = pathname.length > 1 ? pathname.slice(0, 20) + "…" : "";
    return `${hostname}${path}`;
  } catch {
    return url.length > maxLen ? url.slice(0, maxLen) + "…" : url;
  }
};
