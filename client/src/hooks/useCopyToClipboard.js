/**
 * hooks/useCopyToClipboard.js — Copy text with visual feedback
 */
import { useState, useCallback } from "react";

const useCopyToClipboard = (resetDelay = 2000) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text) => {
    if (!text) return false;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
      return true;
    } catch {
      // Fallback for older browsers / non-secure contexts
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
        return true;
      } catch {
        return false;
      }
    }
  }, [resetDelay]);

  return { copied, copy };
};

export default useCopyToClipboard;
