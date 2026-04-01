/**
 * routes/urlRoutes.js — Express router for URL shortener endpoints
 */

const express = require("express");
const router = express.Router();
const { shortenUrl, redirectUrl, getStats } = require("../controllers/urlController");
const { createLimiter } = require("../middleware/rateLimiter");

// Health check
router.get("/health", (req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

// Create a shortened URL (rate-limited more strictly)
router.post("/api/shorten", createLimiter, shortenUrl);

// Get stats for a short code
router.get("/api/stats/:code", getStats);

// Redirect — must come LAST to avoid swallowing other routes
router.get("/:code", redirectUrl);

module.exports = router;
