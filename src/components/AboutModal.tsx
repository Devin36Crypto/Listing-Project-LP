import { motion, AnimatePresence } from "motion/react";
import { X, Cpu, Shield, Zap, Server, Lock, Database, Activity, Layers } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-zinc-900 border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-brand-500" />
              <h2 className="text-xl font-bold font-display text-white">About ListeningProjectLp</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              title="Close modal"
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-12">

              {/* Hero Section */}
              <div className="text-center space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold font-display text-white">
                  The Universal Translator. <span className="text-brand-500 drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">Re-engineered.</span>
                </h3>
                <p className="text-xl text-gray-400 leading-relaxed">
                  Augmented hearing for a connected world.
                </p>
              </div>

              {/* The Mission */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-400" />
                  The Mission
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  ListeningProjectLp is a neural audio interface designed to decode the world around you. We bypass traditional, high-latency speech-to-text pipelines by leveraging the Gemini Multimodal Live API, delivering fluid, context-aware translation that understands nuance, tone, and speaker identity in real-time.
                </p>
              </div>

              {/* The Architecture */}
              <div>
                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-400" />
                  The Architecture
                </h4>
                <p className="text-gray-400 mb-6">
                  We built ListeningProjectLp as a high-performance Progressive Web App (PWA) to bridge the gap between cloud intelligence and edge security.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                    <div className="bg-brand-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-brand-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h5 className="font-semibold text-white mb-2">Neural Diarization</h5>
                    <p className="text-sm text-gray-400">Instantly distinguishes and labels multiple speakers in a single audio stream.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                    <div className="bg-brand-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-brand-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h5 className="font-semibold text-white mb-2">Adaptive Beamforming</h5>
                    <p className="text-sm text-gray-400">Software-defined noise suppression isolates voices in chaotic acoustic environments.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                    <div className="bg-brand-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-brand-400">
                      <Server className="w-5 h-5" />
                    </div>
                    <h5 className="font-semibold text-white mb-2">Hybrid Inference</h5>
                    <p className="text-sm text-gray-400">Seamlessly switches between cloud-based Gemini models and on-device models (Whisper/nLLB).</p>
                  </div>
                </div>
              </div>

              {/* The Security Stack */}
              <div>
                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-400" />
                  The Security Stack
                </h4>
                <p className="text-gray-400 mb-6">
                  Privacy is hard-coded into our infrastructure. We utilize a Local-First, Zero-Knowledge protocol:
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start bg-white/5 border border-white/10 p-4 rounded-xl">
                    <Database className="w-5 h-5 text-brand-400 mt-1 shrink-0" />
                    <div>
                      <h5 className="font-semibold text-white">Client-Side Storage</h5>
                      <p className="text-sm text-gray-400">All session data lives in your device's IndexedDB, never on our servers.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start bg-white/5 border border-white/10 p-4 rounded-xl">
                    <Lock className="w-5 h-5 text-brand-400 mt-1 shrink-0" />
                    <div>
                      <h5 className="font-semibold text-white">AES-GCM Encryption</h5>
                      <p className="text-sm text-gray-400">Your personal Vault Key encrypts transcripts before they touch the disk.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start bg-white/5 border border-white/10 p-4 rounded-xl">
                    <Cpu className="w-5 h-5 text-brand-400 mt-1 shrink-0" />
                    <div>
                      <h5 className="font-semibold text-white">Ephemeral Processing</h5>
                      <p className="text-sm text-gray-400">Audio streams are processed in memory and discarded immediately—no logs, no training data, no eavesdropping.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
