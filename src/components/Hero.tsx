import { Smartphone, Monitor, Download, Headphones, Tablet, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getDownloadStats } from "../services/supabase";

function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);

      const current = Math.floor(start + (end - start) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}

// Set launch date to today for now, or a specific date.
// User request: "after a year I want it to change to 'Total downloads'"
const LAUNCH_DATE = new Date('2026-01-01'); // Example launch date

export default function Hero({ onOpenDownload }: { onOpenDownload: (variant: "auto" | "mobile" | "desktop" | "tablet") => void }) {
  const [downloadCount, setDownloadCount] = useState(0);
  const [isTotalMode, setIsTotalMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { weekly, total } = await getDownloadStats();

        const now = new Date();
        const oneYearAfterLaunch = new Date(LAUNCH_DATE);
        oneYearAfterLaunch.setFullYear(oneYearAfterLaunch.getFullYear() + 1);

        if (now > oneYearAfterLaunch) {
          setIsTotalMode(true);
          setDownloadCount(total);
        } else {
          setIsTotalMode(false);
          setDownloadCount(weekly);
        }
      } catch (e) {
        console.error("Failed to fetch download stats", e);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <section id="download" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div>
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-brand-400 mb-6 backdrop-blur-sm">
            The Future of Active Listening
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-display">
            <span className="inline-flex items-center gap-3 sm:gap-5">
              <Headphones className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-brand-500 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]" />
              Hear More.
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-sky-400">
              Understand Better.
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            The Listening Project uses advanced AI to help you capture, analyze, and truly understand every conversation. Available now on Android and Desktop.
          </p>

          {/* Animated Stat */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md min-h-[40px]">
              <div className={`w-2 h-2 ${downloadCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'} rounded-full`} />
              <span className="text-sm font-medium text-gray-300 flex items-center gap-1">
                <Download className="w-3 h-3 text-gray-400" />
                {loading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                ) : (
                  <span className="text-white font-bold tabular-nums">
                    <AnimatedCounter value={downloadCount} />
                  </span>
                )}
                {isTotalMode ? " total downloads" : " downloads this week"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <a
              href="#"
              className="bg-gradient-to-br from-brand-400 to-brand-600 hover:scale-105 transition-all text-black px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              Get LP on Google Play
            </a>
            <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <svg className="w-3 h-3 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              AES-256 Encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <svg className="w-3 h-3 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              GDPR Compliant
            </span>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full">
              <button
                onClick={() => onOpenDownload("mobile")}
                className="flex items-center gap-2 bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm w-full sm:w-auto justify-center"
              >
                <Smartphone className="w-5 h-5" />
                Download for Mobile
              </button>

              <button
                onClick={() => onOpenDownload("desktop")}
                className="flex items-center gap-2 bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm w-full sm:w-auto justify-center"
              >
                <Monitor className="w-5 h-5" />
                Download for Desktop
              </button>
            </div>

            <button
              onClick={() => onOpenDownload("tablet")}
              className="flex items-center gap-2 bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm w-full sm:w-auto justify-center"
            >
              <Tablet className="w-5 h-5" />
              Download for Tablet
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            iOS version coming soon.
          </p>
        </div>
      </div>
    </section>
  );
}
