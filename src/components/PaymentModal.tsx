import { motion, AnimatePresence } from "motion/react";
import { X, CreditCard, Lock, CheckCircle, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: string;
    period?: string;
  } | null;
}

export default function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [step, setStep] = useState<"details" | "processing" | "success">("details");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("details");
      setEmail("");
      setCardNumber("");
      setExpiry("");
      setCvc("");
    }
  }, [isOpen]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");
    
    // Simulate API call
    setTimeout(() => {
      setStep("success");
    }, 2000);
  };

  if (!isOpen || !plan) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#121212] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {step === "details" && (
                <div className="p-8">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold font-display mb-2">Checkout</h3>
                    <div className="flex items-baseline gap-2 text-gray-400">
                      <span>Subscribing to</span>
                      <span className="text-brand-400 font-semibold">{plan.name} Plan</span>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white/5 rounded-xl p-4 mb-8 flex justify-between items-center border border-white/5">
                    <div>
                      <p className="text-sm text-gray-400">Total due today</p>
                      <p className="text-xl font-bold text-white">{plan.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Frequency</p>
                      <p className="text-sm text-gray-300">{plan.period || "One-time"}</p>
                    </div>
                  </div>

                  <form onSubmit={handlePayment} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Card Details</label>
                      <div className="space-y-3">
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors font-mono"
                            placeholder="0000 0000 0000 0000"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            required
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors font-mono text-center"
                            placeholder="MM/YY"
                          />
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                              type="text"
                              required
                              value={cvc}
                              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                              className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors font-mono"
                              placeholder="CVC"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-xl font-semibold shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      Pay {plan.price}
                    </button>
                    
                    <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" />
                      Payments are secure and encrypted
                    </p>
                  </form>
                </div>
              )}

              {step === "processing" && (
                <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="relative w-20 h-20 mb-8">
                    <div className="absolute inset-0 border-4 border-brand-500/30 rounded-full" />
                    <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Processing Payment...</h3>
                  <p className="text-gray-400 text-center">Please do not close this window.</p>
                </div>
              )}

              {step === "success" && (
                <div className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-4">Payment Successful!</h3>
                  <p className="text-gray-400 mb-8">
                    Thank you for subscribing to the {plan.name} plan. A receipt has been sent to {email}.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Continue to App
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
