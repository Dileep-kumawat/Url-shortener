/**
 * components/Header.jsx — Top navigation bar
 */
import { motion } from "framer-motion";
import { Scissors, HeartHandshake } from "lucide-react";

const Header = () => (
  <motion.header
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4"
    style={{
      background: "rgba(8,11,17,0.7)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(42,52,65,0.5)",
    }}
  >
    {/* Logo */}
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-lime-400 flex items-center justify-center glow-lime-sm">
        <Scissors size={16} className="text-ink-950 rotate-45" />
      </div>
      <span className="font-display font-bold text-xl text-slate-100 tracking-tight">snip</span>
    </div>

    {/* Nav links */}
    <nav className="hidden sm:flex items-center gap-1">
      <a
        href="https://www.linkedin.com/in/dileep-kumawat/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-steel-400 hover:text-slate-200 hover:bg-ink-800 text-sm transition-all"
      >
        <HeartHandshake size={14} />
        <span>LinkedIn</span>
      </a>
    </nav>
  </motion.header>
);

export default Header;
