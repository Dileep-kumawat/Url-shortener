/**
 * controllers/urlController.js — Business logic for URL operations
 */

const Url = require("../models/Url");
const { generateShortCode, validateAlias } = require("../utils/generateCode");
const { validateAndNormalise } = require("../utils/validateUrl");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// ──────────────────────────────────────────────
// POST /api/shorten
// ──────────────────────────────────────────────
const shortenUrl = async (req, res) => {
  try {
    const { url, alias, expiresIn } = req.body;

    // 1. Validate the original URL
    const validation = validateAndNormalise(url);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }
    const originalUrl = validation.url;

    // 2. Handle custom alias
    let shortCode;
    if (alias && alias.trim() !== "") {
      const aliasCheck = validateAlias(alias.trim());
      if (!aliasCheck.valid) {
        return res.status(400).json({ success: false, error: aliasCheck.error });
      }
      shortCode = alias.trim();

      // Check alias is not taken
      const existing = await Url.findOne({ shortCode });
      if (existing) {
        // If it maps to the same URL, reuse it
        if (existing.originalUrl === originalUrl) {
          return res.status(200).json({
            success: true,
            data: formatUrlResponse(existing),
          });
        }
        return res
          .status(409)
          .json({ success: false, error: "This alias is already taken. Please choose another." });
      }
    } else {
      // 3. Check if this exact URL was already shortened (dedup)
      const duplicate = await Url.findOne({ originalUrl });
      if (duplicate && !duplicate.isExpired) {
        return res.status(200).json({
          success: true,
          data: formatUrlResponse(duplicate),
        });
      }

      // 4. Generate a unique random short code
      let attempts = 0;
      do {
        shortCode = generateShortCode();
        attempts++;
        if (attempts > 10) {
          return res.status(500).json({ success: false, error: "Failed to generate unique code" });
        }
      } while (await Url.findOne({ shortCode }));
    }

    // 5. Build expiry date if requested
    let expiresAt = null;
    if (expiresIn && Number.isInteger(Number(expiresIn)) && Number(expiresIn) > 0) {
      expiresAt = new Date(Date.now() + Number(expiresIn) * 24 * 60 * 60 * 1000); // days → ms
    }

    // 6. Persist to MongoDB
    const newUrl = await Url.create({ originalUrl, shortCode, expiresAt });

    return res.status(201).json({
      success: true,
      data: formatUrlResponse(newUrl),
    });
  } catch (err) {
    console.error("[shortenUrl]", err);
    return res.status(500).json({ success: false, error: "Server error while shortening URL" });
  }
};

// ──────────────────────────────────────────────
// GET /:code — Redirect to original URL
// ──────────────────────────────────────────────
const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const record = await Url.findOne({ shortCode: code });

    if (!record) {
      return res.status(404).json({ success: false, error: "Short URL not found" });
    }

    // Check expiry
    if (record.isExpired) {
      return res.status(410).json({
        success: false,
        error: "This link has expired",
      });
    }

    // Increment click count and update lastAccessed atomically
    await Url.updateOne(
      { _id: record._id },
      { $inc: { clickCount: 1 }, $set: { lastAccessed: new Date() } }
    );

    return res.redirect(301, record.originalUrl);
  } catch (err) {
    console.error("[redirectUrl]", err);
    return res.status(500).json({ success: false, error: "Server error during redirect" });
  }
};

// ──────────────────────────────────────────────
// GET /api/stats/:code — Return link metadata
// ──────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const { code } = req.params;
    const record = await Url.findOne({ shortCode: code });

    if (!record) {
      return res.status(404).json({ success: false, error: "Short URL not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...formatUrlResponse(record),
        isExpired: record.isExpired,
        lastAccessed: record.lastAccessed,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
    });
  } catch (err) {
    console.error("[getStats]", err);
    return res.status(500).json({ success: false, error: "Server error fetching stats" });
  }
};

// ──────────────────────────────────────────────
// Helper: format a URL document for API response
// ──────────────────────────────────────────────
const formatUrlResponse = (doc) => ({
  id: doc._id,
  originalUrl: doc.originalUrl,
  shortCode: doc.shortCode,
  shortUrl: `${BASE_URL}/${doc.shortCode}`,
  clickCount: doc.clickCount,
  lastAccessed: doc.lastAccessed,
  expiresAt: doc.expiresAt,
  createdAt: doc.createdAt,
});

module.exports = { shortenUrl, redirectUrl, getStats };
