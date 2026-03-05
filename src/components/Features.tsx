import { motion } from "motion/react";
import { Brain, Mic, MessageSquare, Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Deep Understanding",
    description: "Our AI analyzes context, tone, and nuance to provide deeper insights into your conversations."
  },
  {
    icon: Mic,
    title: "Crystal Clear Audio",
    description: "Advanced noise cancellation and audio enhancement for pristine recording quality."
  },
  {
    icon: MessageSquare,
    title: "Smart Summaries",
    description: "Get instant summaries and action items from your meetings and discussions."
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description: "Experience zero-latency transcription and analysis as you speak."
  },
  {
    icon: Shield,
    title: "Military-Grade Encryption",
    description: "Your data is secured with AES-256 encryption. We employ a Zero-Knowledge architecture where possible, ensuring only you have access to your data."
  },
  {
    icon: Globe,
    title: "Multi-language Support",
    description: "Seamlessly translate and understand conversations in over 30 languages."
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
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-400">
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
