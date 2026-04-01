/**
 * utils/qr.js — QR code generation utility using the qrcode library
 */
import QRCode from "qrcode";

/**
 * Generates a QR code as a data URL (PNG) for a given text.
 * @param {string} text — URL to encode
 * @returns {Promise<string>} — base64 data URL
 */
export const generateQRDataUrl = async (text) => {
  try {
    return await QRCode.toDataURL(text, {
      width: 260,
      margin: 2,
      color: {
        dark: "#C8FF57",   // lime dots
        light: "#0D1117",  // ink background
      },
      errorCorrectionLevel: "M",
    });
  } catch (err) {
    console.error("QR generation failed:", err);
    return null;
  }
};
