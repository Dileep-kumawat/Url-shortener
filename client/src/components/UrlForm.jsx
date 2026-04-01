/**
 * components/UrlForm.jsx
 * Main URL input form with alias + expiry advanced options.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Zap, ChevronDown, AlertCircle, Loader2, Settings2 } from "lucide-react";
import useDebounce from "../hooks/useDebounce";
import { shortenUrl } from "../utils/api";

// Basic client-side URL check (mirrors backend logic for instant feedback)
const looksLikeUrl = (val) => {
  if (!val.trim()) return null;
  const withProto = /^https?:\/\//i.test(val) ? val : `https://${val}`;
  try {
    new URL(withProto);
    return true;
  } catch {
    return false;
  }
};

const EXPIRY_OPTIONS = [
  { label: "Never", value: "" },
  { label: "1 day", value: "1" },
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
];

const UrlForm = ({ onSuccess }) => {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [urlValid, setUrlValid] = useState(null); // null | true | false

  const debouncedUrl = useDebounce(url, 400);

  // Live client-side validation feedback
  useEffect(() => {
    if (!debouncedUrl) {
      setUrlValid(null);
      setError("");
      return;
    }
    const result = looksLikeUrl(debouncedUrl);
    setUrlValid(result);
    if (result === false) {
      setError("That doesn't look like a valid URL");
    } else {
      setError("");
    }
  }, [debouncedUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }
    if (urlValid === false) return;

    setLoading(true);
    setError("");

    try {
      const result = await shortenUrl({
        url: url.trim(),
        alias: alias.trim() || undefined,
        expiresIn: expiresIn || undefined,
      });

      if (!result.success) {
        setError(result.error || "Something went wrong");
        return;
      }

      onSuccess(result.data);
      // Reset form
      setUrl("");
      setAlias("");
      setExpiresIn("");
      setShowAdvanced(false);
      setUrlValid(null);
    } catch {
      setError("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const borderColor =
    urlValid === false
      ? "border-red-500/60 focus-within:border-red-500"
      : urlValid === true
      ? "border-lime-400/40 focus-within:border-lime-400/70"
      : "border-ink-600 focus-within:border-steel-400/50";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      {/* Main URL input */}
      <div
        className={`relative flex items-center gap-3 glass-card rounded-2xl px-4 py-3.5 transition-all duration-300 ${borderColor}`}
      >
        <Link2
          size={18}
          className={`shrink-0 transition-colors duration-200 ${
            urlValid === true
              ? "text-lime-400"
              : urlValid === false
              ? "text-red-400"
              : "text-steel-400"
          }`}
        />
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          placeholder="Paste a long URL to shorten it…"
          className="flex-1 bg-transparent text-slate-100 placeholder-steel-500 text-[15px] font-body outline-none"
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
        {url && (
          <button
            type="button"
            onClick={() => { setUrl(""); setUrlValid(null); setError(""); }}
            className="text-steel-500 hover:text-steel-300 transition-colors text-sm px-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 text-red-400 text-sm px-1"
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced options toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="flex items-center gap-1.5 text-steel-400 hover:text-steel-200 text-sm transition-colors ml-1 group"
      >
        <Settings2 size={13} className="group-hover:rotate-45 transition-transform duration-300" />
        <span>Advanced options</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
        />
      </button>

      {/* Advanced: alias + expiry */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Custom alias */}
              <div className="glass-card rounded-xl px-4 py-3 border border-ink-600 focus-within:border-steel-400/40 transition-colors">
                <label className="block text-steel-500 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Custom alias
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-steel-500 text-sm">snip/</span>
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value.replace(/\s/g, "").toLowerCase())}
                    placeholder="my-link"
                    maxLength={20}
                    className="flex-1 bg-transparent text-slate-100 text-sm outline-none placeholder-steel-600"
                  />
                </div>
              </div>

              {/* Expiry */}
              <div className="glass-card rounded-xl px-4 py-3 border border-ink-600 focus-within:border-steel-400/40 transition-colors">
                <label className="block text-steel-500 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Expires after
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {EXPIRY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setExpiresIn(opt.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
                        expiresIn === opt.value
                          ? "bg-lime-400 text-ink-950 font-semibold"
                          : "bg-ink-700/60 text-steel-400 hover:bg-ink-600 hover:text-slate-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={loading || urlValid === false}
        whileTap={{ scale: 0.97 }}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-display font-semibold text-[15px] transition-all duration-200 ${
          loading || urlValid === false
            ? "bg-ink-700 text-steel-500 cursor-not-allowed"
            : "bg-lime-400 text-ink-950 hover:bg-lime-500 glow-lime-sm hover:glow-lime"
        }`}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Shortening…</span>
          </>
        ) : (
          <>
            <Zap size={16} />
            <span>Shorten URL</span>
          </>
        )}
      </motion.button>
    </form>
  );
};

export default UrlForm;
