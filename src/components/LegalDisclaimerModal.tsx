import { motion, AnimatePresence } from "motion/react";
import { X, Scale, AlertTriangle, Globe, ShieldAlert } from "lucide-react";

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegalDisclaimerModal({ isOpen, onClose }: LegalDisclaimerModalProps) {
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
          className="relative bg-zinc-900 border border-white/10 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold font-display">Legal Disclaimer</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6 md:p-10 space-y-8 text-gray-300 leading-relaxed custom-scrollbar">
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 flex gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
              <div>
                <h3 className="text-yellow-500 font-semibold mb-2">Important Warning</h3>
                <p className="text-sm text-yellow-200/80">
                  The Listening Project application provides tools for recording and transcribing audio. It is your sole responsibility to ensure that your use of this technology complies with all applicable local, state, federal, and international laws.
                </p>
              </div>
            </div>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                1. Recording Laws & Consent
              </h3>
              <p>
                Laws regarding the recording of conversations vary significantly by jurisdiction:
              </p>
              <ul className="list-disc pl-5 space-y-3 mt-4">
                <li>
                  <strong>One-Party Consent:</strong> In some jurisdictions (e.g., U.S. federal law and many states), you may record a conversation if you are a party to the conversation or have obtained consent from one party.
                </li>
                <li>
                  <strong>All-Party (Two-Party) Consent:</strong> In other jurisdictions (e.g., California, Florida, Massachusetts), you must obtain the consent of <strong>all parties</strong> involved in the conversation before recording.
                </li>
                <li>
                  <strong>International Laws:</strong> Laws in the EU (GDPR) and other countries often have strict requirements regarding the recording of individuals without their explicit knowledge and consent.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
                2. User Responsibility & Liability
              </h3>
              <p>
                By using the Listening Project app, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-5 space-y-3 mt-4">
                <li>
                  You are solely responsible for determining the applicable laws in your jurisdiction.
                </li>
                <li>
                  You will obtain all necessary consents from all participants before recording any conversation.
                </li>
                <li>
                  The Listening Project and its developers assume no liability for any unauthorized or illegal recordings made using this application.
                </li>
                <li>
                  You indemnify and hold harmless the Listening Project from any legal actions, claims, or damages arising from your use of the recording features.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">
                3. Privacy & Data Handling
              </h3>
              <p>
                While we implement strong encryption and security measures (as detailed in our Privacy Policy), the act of recording itself may be subject to privacy laws beyond data security. You must respect the privacy rights of others and should not use this tool to infringe upon those rights.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">
                4. Professional Advice
              </h3>
              <p>
                The information provided here is for informational purposes only and does not constitute legal advice. If you are unsure about the legality of recording a specific conversation, you should consult with a qualified attorney in your jurisdiction.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-zinc-900/50 backdrop-blur-md flex justify-end">
            <button 
              onClick={onClose}
              className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              I Understand
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
