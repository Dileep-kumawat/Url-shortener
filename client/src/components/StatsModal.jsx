/**
 * components/StatsModal.jsx
 * Modal overlay showing click stats and metadata for a short link.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MousePointerClick, Clock, Calendar, Link2, Loader2, AlertCircle } from "lucide-react";
import { fetchStats } from "../utils/api";
import { formatDate, timeAgo, truncateUrl } from "../utils/format";

const Stat = ({ icon: Icon, label, value, mono = false }) => (
  <div className="glass-card bg-black rounded-xl px-4 py-3.5 border border-ink-600 flex items-start gap-3">
    <div className="p-2 rounded-lg bg-ink-800 text-lime-400 shrink-0">
      <Icon size={14} />
    </div>
    <div className="min-w-0">
      <p className="text-steel-500 text-xs uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-slate-100 text-sm font-medium truncate ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  </div>
);

const StatsModal = ({ shortCode, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchStats(shortCode);
        if (result.success) setData(result.data);
        else setError(result.error || "Failed to load stats");
      } catch {
        setError("Network error loading stats");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [shortCode]);

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(8, 11, 17, 0.85)", backdropFilter: "blur(6px)" }}
        onClick={handleBackdrop}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 16 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="glass-card rounded-2xl border border-ink-600 w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-600">
            <div>
              <h2 className="font-display font-semibold text-slate-100 text-lg">Link Analytics</h2>
              <p className="text-steel-500 text-xs font-mono mt-0.5">/{shortCode}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-steel-400 hover:text-slate-200 hover:bg-ink-700 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5">
            {loading && (
              <div className="flex items-center justify-center py-10 gap-2 text-steel-400">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Loading stats…</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-400 py-6 justify-center">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {data && (
              <div className="space-y-3">
                {/* Click count — featured stat */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl px-5 py-4 flex items-center gap-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(200,255,87,0.12) 0%, rgba(87,255,204,0.06) 100%)",
                    border: "1px solid rgba(200,255,87,0.2)",
                  }}
                >
                  <div className="text-4xl font-display font-bold text-lime-400">
                    {data.clickCount.toLocaleString()}
                  </div>
                  <div>
                    <p className="text-lime-400/80 text-sm font-medium">Total clicks</p>
                    <p className="text-steel-500 text-xs">All time</p>
                  </div>
                </motion.div>

                {/* Stat grid */}
                <div className="grid grid-cols-1 gap-2">
                  <Stat
                    icon={Link2}
                    label="Original URL"
                    value={truncateUrl(data.originalUrl, 52)}
                    mono
                  />
                  <Stat
                    icon={Calendar}
                    label="Created"
                    value={formatDate(data.createdAt)}
                  />
                  <Stat
                    icon={Clock}
                    label="Last accessed"
                    value={data.lastAccessed ? `${formatDate(data.lastAccessed)} (${timeAgo(data.lastAccessed)})` : "Never visited"}
                  />
                  {data.expiresAt && (
                    <Stat
                      icon={Clock}
                      label={data.isExpired ? "Expired on" : "Expires on"}
                      value={formatDate(data.expiresAt)}
                    />
                  )}
                </div>

                {/* Expired badge */}
                {data.isExpired && (
                  <div className="rounded-xl px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    ⚠ This link has expired and no longer redirects
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StatsModal;
