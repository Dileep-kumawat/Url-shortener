/**
 * utils/generateCode.js — Generates unique short codes
 * Uses a URL-safe alphanumeric alphabet for clean, readable codes.
 */

const { nanoid } = require("nanoid");

// Alphabet: uppercase + lowercase letters + digits (no ambiguous chars like 0/O/l/I)
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
const CODE_LENGTH = 7; // 57^7 ≈ 1.9 trillion combinations — virtually no collisions

/**
 * Generates a random alphanumeric short code.
 * @param {number} length - Desired code length (default 7)
 * @returns {string} Short code string
 */
const generateShortCode = (length = CODE_LENGTH) => {
  // nanoid with custom alphabet for readability
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
};

/**
 * Validates a custom alias provided by the user.
 * Must be 3–20 chars, alphanumeric + hyphens only.
 * @param {string} alias
 * @returns {{ valid: boolean, error?: string }}
 */
const validateAlias = (alias) => {
  if (!alias || typeof alias !== "string") {
    return { valid: false, error: "Alias must be a non-empty string" };
  }
  if (alias.length < 3 || alias.length > 20) {
    return { valid: false, error: "Alias must be 3–20 characters long" };
  }
  if (!/^[a-zA-Z0-9-_]+$/.test(alias)) {
    return {
      valid: false,
      error: "Alias may only contain letters, numbers, hyphens, and underscores",
    };
  }
  // Reserved paths
  const RESERVED = ["api", "health", "admin", "static", "assets"];
  if (RESERVED.includes(alias.toLowerCase())) {
    return { valid: false, error: `"${alias}" is a reserved word` };
  }
  return { valid: true };
};

module.exports = { generateShortCode, validateAlias };
