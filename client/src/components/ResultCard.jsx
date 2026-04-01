/**
 * components/ResultCard.jsx
 * Displays the shortened URL with copy button, QR code, and stats link.
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, QrCode, X, Download, BarChart2, Clock } from "lucide-react";
import useCopyToClipboard from "../hooks/useCopyToClipboard";
import { generateQRDataUrl } from "../utils/qr";
import { truncateUrl, formatDate } from "../utils/format";
import StatsModal from "./StatsModal";

const ResultCard = ({ data, onDismiss }) => {
  const { copied, copy } = useCopyToClipboard();
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Generate QR code as soon as we have a short URL
  useEffect(() => {
    if (data?.shortUrl) {
      generateQRDataUrl(data.shortUrl).then(setQrDataUrl);
    }
  }, [data?.shortUrl]);

  if (!data) return null;

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `snip-${data.shortCode}.png`;
    a.click();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="glass-card rounded-2xl border border-lime-400/20 glow-lime-sm overflow-hidden"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span className="text-lime-400 text-xs font-mono font-medium uppercase tracking-widest">
              Link ready
            </span>
          </div>
          <button
            onClick={onDismiss}
            className="text-steel-500 hover:text-steel-300 transition-colors p-1 rounded-lg hover:bg-ink-700"
          >
            <X size={14} />
          </button>
        </div>

        {/* Short URL + copy */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-3 bg-ink-950/60 rounded-xl px-4 py-3 border border-ink-600 mb-3">
            <span className="flex-1 font-mono text-lime-400 text-[15px] font-medium tracking-wide truncate">
              {data.shortUrl}
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Open link */}
              <a
                href={data.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-steel-400 hover:text-lime-400 hover:bg-ink-700 transition-all"
                title="Open link"
              >
                <ExternalLink size={15} />
              </a>

              {/* Copy */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => copy(data.shortUrl)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  copied
                    ? "bg-lime-400 text-ink-950"
                    : "bg-ink-700 text-slate-200 hover:bg-ink-600"
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </motion.button>
            </div>
          </div>

          {/* Original URL */}
          <p className="text-steel-500 text-xs px-1 mb-4 truncate" title={data.originalUrl}>
            ↗ {truncateUrl(data.originalUrl, 60)}
          </p>

          {/* Metadata row */}
          <div className="flex items-center gap-3 flex-wrap">
            {data.expiresAt && (
              <span className="flex items-center gap-1.5 text-steel-400 text-xs">
                <Clock size={11} />
                Expires {formatDate(data.expiresAt)}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-4">
            {/* QR toggle */}
            <button
              onClick={() => setShowQr((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                showQr
                  ? "bg-lime-400/10 border-lime-400/30 text-lime-400"
                  : "bg-ink-800 border-ink-600 text-steel-400 hover:text-slate-200 hover:border-steel-500"
              }`}
            >
              <QrCode size={13} />
              QR Code
            </button>

            {/* Stats */}
            <button
              onClick={() => setShowStats(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border bg-ink-800 border-ink-600 text-steel-400 hover:text-slate-200 hover:border-steel-500 transition-all duration-200"
            >
              <BarChart2 size={13} />
              Stats
            </button>
          </div>

          {/* QR Code panel */}
          {showQr && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex flex-col items-center gap-3"
            >
              {qrDataUrl ? (
                <>
                  <div className="p-3 rounded-2xl bg-ink-950 border border-ink-600">
                    <img
                      src={qrDataUrl}
                      alt={`QR code for ${data.shortUrl}`}
                      className="w-48 h-48 rounded-xl"
                    />
                  </div>
                  <button
                    onClick={handleDownloadQr}
                    className="flex items-center gap-1.5 text-steel-400 hover:text-lime-400 text-xs transition-colors"
                  >
                    <Download size={12} />
                    Download PNG
                  </button>
                </>
              ) : (
                <div className="w-48 h-48 rounded-xl bg-ink-800 animate-pulse" />
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Stats modal */}
      {showStats && (
        <StatsModal shortCode={data.shortCode} onClose={() => setShowStats(false)} />
      )}
    </>
  );
};

export default ResultCard;
