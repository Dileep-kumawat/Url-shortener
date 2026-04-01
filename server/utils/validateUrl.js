/**
 * utils/validateUrl.js — URL validation helpers
 */

const validUrl = require("valid-url");

/**
 * Validates and normalises a URL string.
 * @param {string} url - Raw URL input from user
 * @returns {{ valid: boolean, url?: string, error?: string }}
 */
const validateAndNormalise = (url) => {
  if (!url || typeof url !== "string") {
    return { valid: false, error: "URL is required" };
  }

  let trimmed = url.trim();

  // Auto-prepend https:// if no protocol given
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = "https://" + trimmed;
  }

  if (!validUrl.isWebUri(trimmed)) {
    return { valid: false, error: "Please enter a valid URL (e.g. https://example.com)" };
  }

  // Block localhost / private IPs in production
  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.toLowerCase();
    const privatePatterns = [
      /^localhost$/,
      /^127\./,
      /^10\./,
      /^192\.168\./,
      /^172\.(1[6-9]|2\d|3[01])\./,
    ];
    if (privatePatterns.some((p) => p.test(hostname))) {
      return { valid: false, error: "Shortening private/local URLs is not allowed" };
    }
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }

  return { valid: true, url: trimmed };
};

module.exports = { validateAndNormalise };
