import { motion, useSpring, useTransform } from "motion/react";
import { Smartphone, Monitor, Download, Headphones, Tablet } from "lucide-react";
import { useEffect, useState } from "react";

function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export default function Hero({ onOpenDownload }: { onOpenDownload: (variant: "auto" | "mobile" | "desktop" | "tablet") => void }) {
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    // Simulate fetching live data
    setDownloadCount(12450);
  }, []);

  return (
    <section id="download" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-6 backdrop-blur-sm">
            The Future of Active Listening
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-display">
            <span className="inline-flex items-center gap-3 sm:gap-5">
              <Headphones className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-indigo-500" />
              Hear More.
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Understand Better.
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            The Listening Project uses advanced AI to help you capture, analyze, and truly understand every conversation. Available now on Android and Desktop.
          </p>
          
          {/* Animated Stat */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-300 flex items-center gap-1">
                <Download className="w-3 h-3 text-gray-400" />
                <span className="text-white font-bold tabular-nums">
                  <AnimatedCounter value={downloadCount} />+
                </span>
                downloads this week
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              AES-256 Encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              GDPR Compliant
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
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
        </motion.div>
      </div>
    </section>
  );
}
