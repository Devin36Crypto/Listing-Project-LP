import { motion, AnimatePresence } from "motion/react";
import { X, Search, Book, MessageCircle, FileQuestion, ChevronRight } from "lucide-react";
import { useState } from "react";

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContactSupport: () => void;
}

export default function HelpCenterModal({ isOpen, onClose, onContactSupport }: HelpCenterModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: Book,
      title: "Getting Started",
      articles: ["How to install the app", "Using the Web App", "Creating your first recording", "Understanding the dashboard"]
    },
    {
      icon: MessageCircle,
      title: "Transcription & AI",
      articles: ["Improving transcription accuracy", "Using AI insights", "Exporting your data"]
    },
    {
      icon: FileQuestion,
      title: "Account & Billing",
      articles: ["Managing your subscription", "Updating payment methods", "Canceling your plan"]
    }
  ];

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
            <h2 className="text-xl font-bold font-display">Help Center</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar">
            {/* Search */}
            <div className="relative mb-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for help articles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {categories.map((category, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-colors group cursor-pointer">
                  <div className="w-10 h-10 bg-brand-500/20 rounded-lg flex items-center justify-center mb-4 text-brand-400 group-hover:text-brand-300 transition-colors">
                    <category.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-4">{category.title}</h3>
                  <ul className="space-y-3">
                    {category.articles.map((article, aIndex) => (
                      <li key={aIndex} className="text-sm text-gray-400 hover:text-brand-400 transition-colors flex items-center gap-2">
                        <ChevronRight className="w-3 h-3" />
                        {article}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Contact Support CTA */}
            <div className="bg-brand-600/10 border border-brand-500/20 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Still need help?</h3>
              <p className="text-brand-200 mb-6">Our support team is available 24/7 to assist you with any questions.</p>
              <button 
                onClick={onContactSupport}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
