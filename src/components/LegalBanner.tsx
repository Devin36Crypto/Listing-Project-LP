import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";

export default function LegalBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the banner
    const hasDismissed = localStorage.getItem("legal_banner_dismissed");
    if (!hasDismissed) {
      // Show after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("legal_banner_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-7xl mx-auto bg-zinc-900/95 backdrop-blur-md border border-yellow-500/30 rounded-xl shadow-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="p-3 bg-yellow-500/10 rounded-full shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">Legal Disclaimer: Recording Laws</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Laws regarding the recording of conversations vary by jurisdiction. In many regions, you must obtain the consent of all parties before recording. By using this app, you agree to comply with all applicable laws and regulations.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleDismiss}
                className="flex-1 md:flex-none bg-white text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm whitespace-nowrap"
              >
                I Understand
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
