import { Smartphone, Monitor, Download, Tablet, Loader2, Headphones } from "lucide-react";
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
      {/* Dynamic Background Atmosphere with Prism Icons */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-brand-500/10 rounded-full blur-[100px] animate-float opacity-50" />
        <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-sky-500/10 rounded-full blur-[120px] animate-float opacity-30" style={{ animationDelay: '-5s' }} />
        
        {/* Floating Prism Icons */}
        <img 
          src="/prism-official-brand-mark.png" 
          alt="" 
          className="absolute top-[20%] right-[15%] w-32 h-32 opacity-20 blur-[2px] animate-float" 
          style={{ animationDelay: '-2s' }}
        />
        <img 
          src="/prism-master-verified.webp" 
          alt="" 
          className="absolute bottom-[25%] left-[15%] w-48 h-48 opacity-10 blur-[4px] animate-float" 
          style={{ animationDelay: '-8s' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div>
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-brand-400 mb-6 backdrop-blur-sm">
            The Future of Active Listening
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-display">
            <span className="inline-flex items-center gap-3 sm:gap-5">
              <Headphones className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-brand-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]" />
              Hear More.
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-sky-400">
              Understand Better.
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            ListeningProject uses advanced AI to help you capture, analyze, and truly understand every conversation. Available now on Android and Desktop.
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

            <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <svg className="w-3 h-3 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              AES-256 Encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <svg className="w-3 h-3 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              GDPR Compliant
            </span>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full">
              <button
                onClick={() => onOpenDownload("mobile")}
                className="flex items-center gap-2 bg-gradient-to-br from-brand-400/20 to-brand-600/20 text-brand-400 border border-brand-500/30 px-8 py-4 rounded-full font-bold hover:bg-brand-500/30 hover:scale-[1.05] transition-all backdrop-blur-sm w-full sm:w-auto justify-center shadow-lg shadow-brand-500/10"
              >
                <Smartphone className="w-5 h-5" />
                Download for Mobile
              </button>

              <button
                onClick={() => onOpenDownload("desktop")}
                className="flex items-center gap-2 bg-gradient-to-br from-brand-400 to-brand-600 text-black px-8 py-4 rounded-full font-bold hover:scale-[1.05] transition-all w-full sm:w-auto justify-center shadow-xl shadow-brand-500/25"
              >
                <Monitor className="w-5 h-5" />
                Download for Desktop
              </button>
            </div>

            <button
              onClick={() => onOpenDownload("tablet")}
              className="flex items-center gap-2 bg-white/5 text-gray-400 border border-white/10 px-8 py-4 rounded-full font-semibold hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm w-full sm:w-auto justify-center"
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
