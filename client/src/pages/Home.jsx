/**
 * pages/Home.jsx — Main landing page
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, Zap, QrCode } from "lucide-react";
import UrlForm from "../components/UrlForm";
import ResultCard from "../components/ResultCard";
import RecentUrls from "../components/RecentUrls";
import useLocalHistory from "../hooks/useLocalHistory";

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-3 text-left">
    <div className="p-2 rounded-xl bg-ink-800 border border-ink-600 text-lime-400 shrink-0 mt-0.5">
      <Icon size={14} />
    </div>
    <div>
      <p className="text-slate-200 text-sm font-medium">{title}</p>
      <p className="text-steel-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const Home = () => {
  const [result, setResult] = useState(null);
  const { history, addToHistory, removeFromHistory, clearHistory } = useLocalHistory();

  const handleSuccess = (data) => {
    setResult(data);
    addToHistory(data);
  };

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-28 pb-20 px-4">
      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 max-w-xl"
      >
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime-400/20 bg-lime-400/5 text-lime-400 text-xs font-medium mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
          Fast · Free · No sign-up required
        </motion.div>

        <h1 className="font-display font-bold text-5xl sm:text-6xl text-slate-100 leading-[1.1] mb-4">
          Shorten any
          <br />
          <span className="text-gradient">URL instantly</span>
        </h1>

        <p className="text-steel-400 text-lg leading-relaxed max-w-md mx-auto">
          Clean links. QR codes. Click analytics.
          <br />
          Custom aliases and link expiry included.
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-lg space-y-4"
      >
        {/* Input form */}
        <div className="glass-card rounded-2xl p-5 border border-ink-600 noise-bg">
          <UrlForm onSuccess={handleSuccess} />
        </div>

        {/* Result card */}
        <AnimatePresence mode="wait">
          {result && (
            <ResultCard
              key={result.shortCode}
              data={result}
              onDismiss={() => setResult(null)}
            />
          )}
        </AnimatePresence>

        {/* Recent history */}
        <RecentUrls
          history={history}
          onRemove={removeFromHistory}
          onClear={clearHistory}
        />

        {/* Feature bullets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
        >
          <Feature
            icon={Zap}
            title="Instant shortening"
            desc="Generates a link in under 100ms with dedup detection."
          />
          <Feature
            icon={QrCode}
            title="QR codes"
            desc="Every short link gets a downloadable QR code automatically."
          />
          <Feature
            icon={Shield}
            title="Link analytics"
            desc="Track clicks, last visited time, and expiry status."
          />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-16 text-steel-600 text-xs text-center"
      >
        Built with the MERN stack · No tracking · Open source
      </motion.footer>
    </main>
  );
};

export default Home;
