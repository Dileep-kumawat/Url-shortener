/**
 * server.js — Entry point for the URL Shortener API
 * Configures Express, connects MongoDB, registers routes & middleware.
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load env vars before anything else
dotenv.config();

const urlRoutes = require("./routes/urlRoutes");
const { generalLimiter } = require("./middleware/rateLimiter");

const app = express();
const PORT = process.env.PORT || 5000;

// ──────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
app.use(generalLimiter); // global rate limiting

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────
app.use("/", urlRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.stack);
  res.status(500).json({ success: false, error: "Internal server error" });
});

// ──────────────────────────────────────────────
// Database + Server Start
// ──────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/urlshortener")
  .then(() => {
    console.log("✅  MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀  Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1);
  });
