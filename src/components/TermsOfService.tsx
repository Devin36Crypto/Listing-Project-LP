import { motion, AnimatePresence } from "motion/react";
import { X, FileText, Scale, AlertCircle, CreditCard, UserCheck, Users } from "lucide-react";

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsOfService({ isOpen, onClose }: TermsOfServiceProps) {
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
              <Scale className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-bold font-display">Terms of Service</h2>
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
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing or using the Listening Project application and website (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                2. Description of Service
              </h3>
              <p>
                The Listening Project provides AI-powered audio transcription, emotional analysis, and communication coaching tools. We use advanced artificial intelligence to process your audio inputs and provide text-based outputs and insights.
              </p>
              <p className="mt-2">
                You acknowledge that AI-generated content may not always be 100% accurate and should be verified for critical use cases.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-400" />
                3. User Accounts & Security
              </h3>
              <p>
                To access certain features, you may need to register for an account or provide an API Key. You are responsible for maintaining the confidentiality of your account credentials, API Keys, and Vault Keys.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>You must provide accurate and complete information.</li>
                <li>You are responsible for all activities that occur under your credentials.</li>
                <li>You must notify us immediately of any unauthorized use of your account.</li>
                <li>We are not liable for data loss due to lost Vault Keys, as we do not store them.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                4. Peer-to-Peer Interactions
              </h3>
              <p>
                The Service includes features that allow you to discover and connect with other users nearby ("Spatial Peer Discovery"). By using these features, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Your presence may be visible to other users in your vicinity.</li>
                <li>You are solely responsible for your interactions with other users.</li>
                <li>We do not screen or verify the identity of users you connect with via Peer Discovery.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                5. Subscription and Billing
              </h3>
              <p>
                Certain features of the Service are available only with a paid subscription. By subscribing, you agree to pay the fees associated with your chosen plan.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Billing Cycle:</strong> Subscriptions are billed in advance on a monthly or annual basis.</li>
                <li><strong>Cancellation:</strong> You may cancel your subscription at any time. Your access will continue until the end of the current billing period.</li>
                <li><strong>Refunds:</strong> Payments are generally non-refundable, except as required by law.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-400" />
                5. Prohibited Conduct
              </h3>
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Record conversations without the consent of all parties, where required by law.</li>
                <li>Upload content that is illegal, harmful, threatening, or abusive.</li>
                <li>Reverse engineer, decompile, or attempt to extract the source code of the Service.</li>
                <li>Interfere with or disrupt the integrity or performance of the Service.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">
                6. Intellectual Property
              </h3>
              <p>
                The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of The Listening Project and its licensors.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">
                7. Termination
              </h3>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">
                8. Limitation of Liability
              </h3>
              <p>
                In no event shall The Listening Project, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">
                9. Governing Law
              </h3>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-4">
                10. Changes to Terms
              </h3>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-zinc-900/50 backdrop-blur-md flex justify-end">
            <button 
              onClick={onClose}
              className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              I Agree
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
