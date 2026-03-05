import { motion, AnimatePresence } from "motion/react";
import { X, Shield, Lock, Eye, Server, FileText } from "lucide-react";

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicy({ isOpen, onClose }: PrivacyPolicyProps) {
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
              <Shield className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-bold font-display">Privacy Policy</h2>
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
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-8">
              <p className="text-sm text-indigo-300">
                <strong>Last Updated:</strong> March 1, 2026 <br />
                <strong>Effective Date:</strong> March 1, 2026
              </p>
            </div>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                1. Introduction
              </h3>
              <p>
                Welcome to the Listening Project ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website (collectively, the "Service").
              </p>
              <p className="mt-4">
                By accessing or using the Service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                2. Information We Collect & Local Storage
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Local-First Audio Data:</strong> Audio recordings and transcripts are stored locally on your device using IndexedDB. We do not store your session history on our servers.
                </li>
                <li>
                  <strong>Ephemeral Processing:</strong> Audio sent to our AI partners for transcription is processed in memory and discarded immediately after processing. It is not retained for training purposes.
                </li>
                <li>
                  <strong>Peer Discovery Data:</strong> When using Spatial Peer Discovery, your device may broadcast a temporary, anonymous identifier to nearby devices via Bluetooth or Wi-Fi to facilitate connections. This identifier is not linked to your personal identity.
                </li>
                <li>
                  <strong>Personal Information:</strong> When you register or use API keys, we handle credentials securely. Vault Keys are never transmitted to us.
                </li>
                <li>
                  <strong>Usage Data:</strong> We automatically collect anonymous information about your device and app usage statistics to improve our Service.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-400" />
                3. How We Use Your Information
              </h3>
              <p>We use the collected data for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>To provide, operate, and maintain the Service.</li>
                <li>To process audio files for transcription and emotional analysis using AI technologies.</li>
                <li>To improve, personalize, and expand our Service.</li>
                <li>To communicate with you, including for customer service, updates, and marketing (with your consent).</li>
                <li>To detect and prevent fraud and ensure security.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-400" />
                4. AI Processing & Third Parties
              </h3>
              <p>
                We utilize advanced Artificial Intelligence (AI) providers, including Google Gemini, to process your audio and text data. 
              </p>
              <p className="mt-2">
                <strong>Data Privacy with AI:</strong> Your audio and transcripts are sent to our AI partners solely for the purpose of processing your request. We have data processing agreements in place to ensure your data is not used to train their public models without your explicit consent.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-400" />
                5. Data Security & Encryption
              </h3>
              <p>
                We implement military-grade security measures to protect your personal information and audio data both in transit and at rest.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>End-to-End Encryption:</strong> All data transmitted between your device and our servers is encrypted using TLS 1.3.
                </li>
                <li>
                  <strong>At-Rest Encryption:</strong> Data stored on your device is protected by your device's native encryption. Any data temporarily processed on our servers is encrypted using AES-256.
                </li>
                <li>
                  <strong>Zero-Knowledge Architecture:</strong> We design our systems so that we cannot access your private recordings. Your encryption keys are managed locally on your device where possible.
                </li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">
                6. Data Retention
              </h3>
              <p>
                We retain your personal information and audio data only for as long as is necessary for the purposes set out in this Privacy Policy. You can request the deletion of your data at any time by contacting support.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">
                7. Your Data Rights (GDPR & CCPA)
              </h3>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
                <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
                <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data.</li>
                <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">
                8. Children's Privacy
              </h3>
              <p>
                Our Service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">
                9. Contact Us
              </h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <p className="mt-2 text-indigo-400">
                By email: privacy@listeningproject.com
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-zinc-900/50 backdrop-blur-md flex justify-end">
            <button 
              onClick={onClose}
              className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
