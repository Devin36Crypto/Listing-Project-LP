import { motion, AnimatePresence } from "motion/react";
import { 
  X, Brain, Mic, MessageSquare, Zap, Shield, Globe, Smartphone, 
  Volume2, WifiOff, Layers, Users, Database, Search, Download, 
  Type, Monitor, Lock, AudioWaveform, Scan
} from "lucide-react";

interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeaturesModal({ isOpen, onClose }: FeaturesModalProps) {
  if (!isOpen) return null;

  const categories = [
    {
      title: "Core Capabilities",
      features: [
        {
          icon: Globe,
          title: "Real-Time Universal Translator",
          description: "Instantly translates spoken audio into your target language with near-zero latency."
        },
        {
          icon: Scan,
          title: "Multi-Language Scanning",
          description: "Automatically detects and identifies multiple languages spoken in the same conversation."
        },
        {
          icon: Users,
          title: "Speaker Identification",
          description: "Distinguishes between different voices and labels them (e.g., \"Speaker 1\", \"Speaker 2\") in the transcript."
        },
        {
          icon: Brain,
          title: "Context-Aware AI Assistant",
          description: "Ask questions about the conversation or get cultural context for terms mentioned in real-time."
        },
        {
          icon: Users,
          title: "Spatial Peer Discovery",
          description: "Discover and connect with other Listening Project users nearby for synchronized translation sessions."
        }
      ]
    },
    {
      title: "Privacy & Security",
      features: [
        {
          icon: Database,
          title: "Local-First Architecture",
          description: "All session data is stored locally on your device, not in the cloud."
        },
        {
          icon: Shield,
          title: "Zero-Knowledge Encryption",
          description: "Secure your transcripts with a personal Vault Key that ensures only you can access your history."
        },
        {
          icon: Smartphone,
          title: "Pocket Mode",
          description: "Lock your screen while keeping the microphone active for discreet, battery-saving operation."
        }
      ]
    },
    {
      title: "Advanced Audio",
      features: [
        {
          icon: AudioWaveform,
          title: "Beamforming & Noise Suppression",
          description: "Filters out background noise in crowded environments (cafes, streets) to focus on the speaker."
        },
        {
          icon: WifiOff,
          title: "Offline Mode",
          description: "Continue recording and transcribing even without an internet connection (uses on-device models)."
        },
        {
          icon: Mic,
          title: "Push-to-Talk",
          description: "Optional mode for precise control over when the app is listening."
        }
      ]
    },
    {
      title: "Data Management",
      features: [
        {
          icon: Search,
          title: "Searchable History",
          description: "Easily browse past conversations with full-text search and date filtering."
        },
        {
          icon: Download,
          title: "Export & Backup",
          description: "Export your transcripts and settings to JSON for safekeeping or transfer between devices."
        },
        {
          icon: Users,
          title: "Speaker Registry",
          description: "Name and manage identified speakers (e.g., rename \"Speaker 1\" to \"John\") for clearer transcripts."
        }
      ]
    },
    {
      title: "Accessibility & Customization",
      features: [
        {
          icon: Volume2,
          title: "Custom AI Voices",
          description: "Choose from multiple AI voice personalities (Energetic, Deep, Soft, etc.) for spoken translations."
        },
        {
          icon: Type,
          title: "Dynamic Text Sizing",
          description: "Transcripts automatically adjust for readability."
        },
        {
          icon: Monitor,
          title: "Cross-Platform PWA",
          description: "Install directly from the browser on iOS, Android, Windows, and Mac without an app store."
        }
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
          className="relative bg-zinc-900 border border-white/10 w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-bold font-display">All Features</h2>
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
            <div className="space-y-12">
              {categories.map((category, catIndex) => (
                <div key={catIndex}>
                  <h3 className="text-lg font-bold text-white mb-6 pl-3 border-l-4 border-indigo-500 flex items-center gap-2">
                    {category.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.features.map((feature, index) => (
                      <div 
                        key={index}
                        className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-colors group"
                      >
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/20 transition-colors">
                          <feature.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-center">
              <h3 className="text-xl font-bold text-white mb-2">Ready to experience better listening?</h3>
              <p className="text-indigo-200 mb-6 max-w-xl mx-auto">
                Join thousands of users who have transformed their communication skills with the Listening Project.
              </p>
              <button 
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg shadow-indigo-500/20"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
