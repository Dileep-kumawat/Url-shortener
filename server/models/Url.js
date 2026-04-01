/**
 * models/Url.js — Mongoose schema for shortened URLs
 */

const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    // The full original URL provided by the user
    originalUrl: {
      type: String,
      required: [true, "Original URL is required"],
      trim: true,
    },

    // Unique alphanumeric short code (6–8 chars, or custom alias)
    shortCode: {
      type: String,
      required: [true, "Short code is required"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },

    // How many times this short link has been visited
    clickCount: {
      type: Number,
      default: 0,
    },

    // Timestamp of the most recent redirect
    lastAccessed: {
      type: Date,
      default: null,
    },

    // Optional: link expiry (null = never expires)
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Virtual: is this link currently expired?
urlSchema.virtual("isExpired").get(function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

module.exports = mongoose.model("Url", urlSchema);
