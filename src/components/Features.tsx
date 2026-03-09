import { motion } from "motion/react";
import { Brain, Mic, MessageSquare, Zap, Shield, Globe, Users, Cloud } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Universal Translator",
    description: "Instantly translate spoken audio into your target language with near-zero latency using Gemini Flash."
  },
  {
    icon: Shield,
    title: "Private Vault Keys",
    description: "Secure your session history with a local Vault Key. Only you hold the key to decrypt your personal data."
  },
  {
    icon: Zap,
    title: "Offline Intelligence",
    description: "Continue recording and transcribing even without a connection using optimized on-device neural models."
  },
  {
    icon: Brain,
    title: "AI Audio Insights",
    description: "Ask questions about any conversation or extract action items with context-aware AI analysis."
  },
  {
    icon: Users,
    title: "Spatial Peer Sync",
    description: "Discover nearby users for synchronized group translation sessions and shared session contexts."
  },
  {
    icon: Cloud,
    title: "Encrypted Cloud Sync",
    description: "Securely backup your encrypted sessions to the cloud and sync across all your devices seamlessly."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-black/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">Designed for Clarity</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to become a better listener, powered by next-generation technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center mb-6 text-brand-400">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
