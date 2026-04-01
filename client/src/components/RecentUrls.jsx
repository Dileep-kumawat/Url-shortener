/**
 * components/RecentUrls.jsx
 * Displays recently shortened URLs from localStorage.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Trash2, BarChart2, History, ChevronDown, ExternalLink } from "lucide-react";
import useCopyToClipboard from "../hooks/useCopyToClipboard";
import { truncateUrl, timeAgo } from "../utils/format";
import StatsModal from "./StatsModal";

const RecentItem = ({ item, onRemove }) => {
  const { copied, copy } = useCopyToClipboard(1500);
  const [statsCode, setStatsCode] = useState(null);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-ink-800/60 group transition-colors"
      >
        {/* Short code badge */}
        <span className="font-mono text-lime-400 text-xs bg-lime-400/8 border border-lime-400/15 rounded-lg px-2 py-1 shrink-0 min-w-[72px] text-center">
          /{item.shortCode}
        </span>

        {/* URL info */}
        <div className="flex-1 min-w-0">
          <p className="text-slate-300 text-sm truncate">{truncateUrl(item.originalUrl)}</p>
          <p className="text-steel-600 text-xs mt-0.5">{timeAgo(item.createdAt)}</p>
        </div>

        {/* Actions (visible on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <a
            href={item.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-steel-500 hover:text-lime-400 hover:bg-ink-700 transition-all"
            title="Open"
          >
            <ExternalLink size={13} />
          </a>

          <button
            onClick={() => copy(item.shortUrl)}
            className={`p-1.5 rounded-lg transition-all ${
              copied ? "text-lime-400" : "text-steel-500 hover:text-slate-200 hover:bg-ink-700"
            }`}
            title="Copy"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>

          <button
            onClick={() => setStatsCode(item.shortCode)}
            className="p-1.5 rounded-lg text-steel-500 hover:text-steel-200 hover:bg-ink-700 transition-all"
            title="Stats"
          >
            <BarChart2 size={13} />
          </button>

          <button
            onClick={() => onRemove(item.shortCode)}
            className="p-1.5 rounded-lg text-steel-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Remove"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </motion.div>

      {statsCode && (
        <StatsModal shortCode={statsCode} onClose={() => setStatsCode(null)} />
      )}
    </>
  );
};

const RecentUrls = ({ history, onRemove, onClear }) => {
  const [collapsed, setCollapsed] = useState(false);

  if (!history || history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="glass-card rounded-2xl border border-ink-600 "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-ink-700/60">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-2 text-steel-400 hover:text-slate-200 transition-colors group"
        >
          <History size={14} />
          <span className="text-sm font-medium">Recent links</span>
          <span className="text-xs bg-ink-700 text-steel-400 rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
            {history.length}
          </span>
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${collapsed ? "-rotate-90" : ""}`}
          />
        </button>

        <button
          onClick={onClear}
          className="text-steel-600 hover:text-red-400 text-xs transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* List */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-1 py-2 max-h-72 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {history.map((item) => (
                  <RecentItem key={item.shortCode} item={item} onRemove={onRemove} />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecentUrls;
