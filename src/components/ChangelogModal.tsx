import { motion, AnimatePresence } from "motion/react";
import { X, GitCommit, Zap, Bug, Star, Calendar } from "lucide-react";

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangelogModal({ isOpen, onClose }: ChangelogModalProps) {
  if (!isOpen) return null;

  const releases = [
    {
      version: "v1.3.0",
      date: "March 6, 2026",
      type: "major",
      changes: [
        { type: "feature", text: "Web App Launch: Access Listening Project directly from your browser." },
        { type: "feature", text: "Gemini Live Integration: Real-time, low-latency voice translation." },
        { type: "improvement", text: "Visualizer: New real-time audio waveform visualization." }
      ]
    },
    {
      version: "v1.2.0",
      date: "March 1, 2026",
      type: "major",
      changes: [
        { type: "feature", text: "Added Tablet Support: Optimized UI for larger screens with split-screen multitasking." },
        { type: "feature", text: "Spatial Peer Discovery: Connect with nearby users for synchronized sessions." },
        { type: "improvement", text: "Enhanced payment flow with 7-day free trial integration." }
      ]
    },
    {
      version: "v1.1.5",
      date: "February 15, 2026",
      type: "minor",
      changes: [
        { type: "improvement", text: "Improved offline transcription accuracy by 15%." },
        { type: "fix", text: "Fixed an issue where audio would occasionally drop on Android devices." },
        { type: "fix", text: "Resolved UI glitch in Dark Mode on iOS Safari." }
      ]
    },
    {
      version: "v1.1.0",
      date: "January 28, 2026",
      type: "minor",
      changes: [
        { type: "feature", text: "Pocket Mode: Lock screen while keeping microphone active." },
        { type: "feature", text: "Added 'Deep' and 'Energetic' AI voice personalities." },
        { type: "improvement", text: "Reduced battery consumption during long recording sessions." }
      ]
    },
    {
      version: "v1.0.0",
      date: "January 1, 2026",
      type: "major",
      changes: [
        { type: "feature", text: "Initial Public Release." },
        { type: "feature", text: "Real-time translation for 30+ languages." },
        { type: "feature", text: "Local-first architecture with AES-256 encryption." }
      ]
    }
  ];

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
          className="relative bg-zinc-900 border border-white/10 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <GitCommit className="w-6 h-6 text-brand-500" />
              <h2 className="text-xl font-bold font-display">Changelog</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar">
            <div className="space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
              {releases.map((release, index) => (
                <div key={index} className="relative pl-12">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-1.5 w-[40px] h-[40px] rounded-full border-4 border-zinc-900 flex items-center justify-center z-10 ${
                    release.type === 'major' ? 'bg-brand-600' : 'bg-zinc-700'
                  }`}>
                    {release.type === 'major' ? <Star className="w-4 h-4 text-white" /> : <GitCommit className="w-4 h-4 text-gray-300" />}
                  </div>

                  <div className="mb-6">
                    <div className="flex flex-wrap items-baseline gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{release.version}</h3>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {release.date}
                      </span>
                    </div>
                    
                    <ul className="space-y-3">
                      {release.changes.map((change, cIndex) => (
                        <li key={cIndex} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                          <span className={`mt-1 shrink-0 ${
                            change.type === 'feature' ? 'text-green-400' :
                            change.type === 'improvement' ? 'text-blue-400' :
                            'text-orange-400'
                          }`}>
                            {change.type === 'feature' && <Zap className="w-4 h-4" />}
                            {change.type === 'improvement' && <Star className="w-4 h-4" />}
                            {change.type === 'fix' && <Bug className="w-4 h-4" />}
                          </span>
                          <span>{change.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
