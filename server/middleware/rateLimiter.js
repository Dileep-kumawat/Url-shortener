/**
 * middleware/rateLimiter.js — Rate limiting to prevent spam / abuse
 */

const rateLimit = require("express-rate-limit");

/**
 * General global limiter — applied to every route.
 * 100 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
});

/**
 * Strict limiter for URL creation — prevents bulk generation.
 * 15 short links per 10 minutes per IP.
 */
const createLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "You have created too many links recently. Please wait a few minutes.",
  },
});

module.exports = { generalLimiter, createLimiter };
