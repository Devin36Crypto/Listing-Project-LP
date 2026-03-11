import { motion, AnimatePresence } from "motion/react";
import { X, Smartphone, Monitor, Download, MoreVertical, Tablet, CreditCard, Check, ChevronDown, Lock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase, recordDownload, startTrial } from "../services/supabase";
import { Purchases } from "@revenuecat/purchases-js";
import { VIP_LIST } from "../constants";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  handleInstallApp: () => void;
  variant?: "auto" | "mobile" | "desktop" | "tablet" | "all";
  initialPlanId?: string;
}

type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
};

export default function DownloadModal({
  isOpen,
  onClose,
  deferredPrompt,
  handleInstallApp,
  variant = "auto",
  initialPlanId
}: DownloadModalProps) {
  const [activeTab, setActiveTab] = useState<"ios" | "android" | "desktop">("desktop");
  const [step, setStep] = useState<"selection" | "verification" | "payment" | "account_setup" | "install">("selection");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(false);

  // Define plans based on variant
  const getPlans = (): Plan[] => {
    switch (variant) {
      case "mobile":
        return [
          { id: "mobile-monthly", name: "Mobile Monthly", price: "$4", period: "/month", features: ["3-Day Free Trial", "Unlimited transcription", "Local storage"] },
          { id: "mobile-annual", name: "Mobile Annual", price: "$40", period: "/year", features: ["3-Day Free Trial", "Save 17%", "Priority support"] }
        ];
      case "tablet":
        return [
          { id: "tablet-monthly", name: "Tablet Monthly", price: "$6", period: "/month", features: ["3-Day Free Trial", "Split-screen", "Handwriting recognition"] },
          { id: "tablet-annual", name: "Tablet Annual", price: "$60", period: "/year", features: ["3-Day Free Trial", "Save 17%", "Encrypted backup"] }
        ];
      case "desktop":
        return [
          { id: "desktop-monthly", name: "Desktop Monthly", price: "$8", period: "/month", features: ["3-Day Free Trial", "Advanced export", "Local storage"] },
          { id: "desktop-annual", name: "Desktop Annual", price: "$80", period: "/year", features: ["3-Day Free Trial", "Save 17%", "Power user tools"] }
        ];
      case "all":
        return [
          { id: "mobile-monthly", name: "Mobile Monthly", price: "$4", period: "/month", features: ["3-Day Free Trial", "Unlimited transcription"] },
          { id: "mobile-annual", name: "Mobile Annual", price: "$40", period: "/year", features: ["3-Day Free Trial", "Save 17%"] },
          { id: "tablet-monthly", name: "Tablet Monthly", price: "$6", period: "/month", features: ["3-Day Free Trial", "Split-screen"] },
          { id: "tablet-annual", name: "Tablet Annual", price: "$60", period: "/year", features: ["3-Day Free Trial", "Save 17%"] },
          { id: "desktop-monthly", name: "Desktop Monthly", price: "$8", period: "/month", features: ["3-Day Free Trial", "Advanced export"] },
          { id: "desktop-annual", name: "Desktop Annual", price: "$80", period: "/year", features: ["3-Day Free Trial", "Save 17%"] }
        ];
      default:
        // Auto/Generic fallback - assume Desktop for now or generic
        return [
          { id: "desktop-monthly", name: "Pro Monthly", price: "$8", period: "/month", features: ["3-Day Free Trial", "All features"] },
          { id: "desktop-annual", name: "Pro Annual", price: "$80", period: "/year", features: ["3-Day Free Trial", "Save 17%"] }
        ];
    }
  };

  const plans = getPlans();

  // Set default plan
  useEffect(() => {
    if (isOpen) {
      if (initialPlanId) {
        setSelectedPlanId(initialPlanId);
      } else {
        setSelectedPlanId(plans[0].id);
      }
      setStep("verification");
      
      // Reset form
      setEmail("");
      setPassword("");
      setError(null);
      setIsDisclaimerAccepted(false);
    }
  }, [isOpen, variant, initialPlanId]);

  // Detect OS for default tab or respect variant
  useEffect(() => {
    if (variant === "mobile" || variant === "tablet") {
      setActiveTab("android");
      return;
    }
    if (variant === "desktop") {
      setActiveTab("desktop");
      return;
    }

    // Auto detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setActiveTab("ios");
    } else if (/android/.test(userAgent)) {
      setActiveTab("android");
    } else {
      setActiveTab("desktop");
    }
  }, [variant]);

  const handleVerification = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      if (supabase.auth.getSession === undefined || import.meta.env.VITE_SUPABASE_URL?.includes('placeholder')) {
        throw new Error("Backend connection not configured. Please add SUPABASE_URL to your deployment settings.");
      }
      
      if (VIP_LIST.includes(email.trim())) {
        // Check if user already exists
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email === email.trim()) {
           setStep("install");
        } else {
           setStep("account_setup");
        }
      } else {
        // ALWAYS go to account setup first for non-VIPs too
        setStep("account_setup");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during verification.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAccountSetup = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      if (import.meta.env.VITE_SUPABASE_URL?.includes('placeholder')) {
        throw new Error("Backend connection not configured.");
      }
      
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;
      
      const platform = activeTab === 'ios' ? 'ios' : activeTab === 'android' ? 'android' : 'desktop';
      recordDownload(platform);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await startTrial(user.id);
      
      if (VIP_LIST.includes(email.trim())) {
        setStep("install");
      } else {
        setStep("payment");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during account setup.");
    } finally {
      setIsProcessing(false);
    }
  };

  // handleAuth is no longer used in its old form, replaced by sequential steps


  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Record download with detected platform
      const platform = activeTab === 'ios' ? 'ios' : activeTab === 'android' ? 'android' : 'desktop';
      recordDownload(platform);

      // Record trial start in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await startTrial(user.id);
      } else {
        throw new Error("User session not found. Please log in again.");
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStep("install");
    } catch (err: any) {
      setError(err.message || "An error occurred during payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const showTabs = variant === "auto";

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
          className="relative bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6 text-brand-500" />
              <h2 className="text-xl font-bold font-display flex items-center gap-2">
                {step === "install" ? "Install Listening Project" : (step === "verification" ? "Verify Membership" : (step === "account_setup" ? "Secure Account" : (step === "payment" ? "Secure Payment" : "Select Plan & Download")))}
                <span className="text-[10px] text-gray-600 font-mono">v1.2-seq</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            {/* Progress Bar */}
            {step !== "install" && (
              <div className="flex gap-2 mb-8">
                {["selection", "verification", "account_setup", "payment"].map((s, i) => {
                  // Skip payment indicator if it's a VIP user (though they might not know yet until verification)
                  // For simplicity, we show all blocks and color them as we go.
                  const isPast = (step === "verification" && i < 1) || 
                                 (step === "account_setup" && i < 2) || 
                                 (step === "payment" && i < 3);
                  const isCurrent = step === s;
                  
                  return (
                    <div key={s} className="flex-1 h-1.5 rounded-full bg-white/5 relative overflow-hidden">
                      <motion.div 
                        className="absolute inset-0 bg-brand-500"
                        initial={{ x: "-100%" }}
                        animate={{ x: (isCurrent || isPast) ? "0%" : "-100%" }}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {step === "selection" && !isLoginMode && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Choose your plan</h3>
                  <p className="text-gray-400">Select the package that fits your needs to start downloading.</p>
                </div>

                <div className="grid gap-4">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${selectedPlanId === plan.id
                        ? "border-brand-500 bg-brand-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-lg">{plan.name}</span>
                        <div className="flex items-end gap-1">
                          <span className="text-2xl font-bold">{plan.price}</span>
                          <span className="text-gray-400 text-sm">{plan.period}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 text-sm text-gray-400">
                        {plan.features.map((feature, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-brand-400" /> {feature}
                          </span>
                        ))}
                      </div>
                      {selectedPlanId === plan.id && (
                        <div className="absolute top-4 right-4 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={() => setStep("verification")}
                    className="w-full bg-gradient-to-br from-brand-400 to-brand-600 text-black py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
                  >
                    Continue to Get Started <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                  </button>

                  <button
                    onClick={() => { setIsLoginMode(true); setStep("verification"); }}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Already have an account? Log in
                  </button>
                </div>
              </div>
            )}

            {step === "verification" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Waitlist Verification</h3>
                  <p className="text-gray-400">Enter your email to check your membership status.</p>
                </div>

                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  onClick={handleVerification}
                  disabled={isProcessing || !email}
                  className="w-full bg-gradient-to-br from-brand-400 to-brand-600 text-black py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
                </button>
              </div>
            )}

            {step === "account_setup" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-brand-400">
                    {VIP_LIST.includes(email.trim()) ? "VIP Access Confirmed" : "Create Your Account"}
                  </h3>
                  <p className="text-gray-400">Set a password to secure your {email} account.</p>
                </div>

                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Secure Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                        placeholder="Create a password"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAccountSetup}
                  disabled={isProcessing || !password}
                  className="w-full bg-gradient-to-br from-brand-400 to-brand-600 text-black py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (VIP_LIST.includes(email.trim()) ? "Secure Account & Download" : "Continue to Payment")}
                </button>
              </div>
            )}


            {step === "payment" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 cursor-pointer hover:text-white" onClick={() => setStep("account_setup")}>
                  <ChevronDown className="w-4 h-4 rotate-90" /> Back to account setup
                </div>

                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-brand-400" />
                      Secure Payment
                    </h3>
                    {plans.find(p => p.id === selectedPlanId) && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">{plans.find(p => p.id === selectedPlanId)?.name}</div>
                        <div className="text-brand-400 font-bold">{plans.find(p => p.id === selectedPlanId)?.price}<span className="text-xs text-gray-500">{plans.find(p => p.id === selectedPlanId)?.period}</span></div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <p className="text-sm text-gray-400">Membership identified for: <span className="text-white font-medium">{email}</span></p>

                    <div className="border-t border-white/10 my-4 pt-4">
                      <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-bold">Card Information</p>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Card Number</label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Expiry</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">CVC</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                  <div className="bg-brand-500/5 border border-brand-500/10 rounded-xl p-4 flex items-start gap-3">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        id="legal-agreement"
                        type="checkbox"
                        checked={isDisclaimerAccepted}
                        onChange={(e) => setIsDisclaimerAccepted(e.target.checked)}
                        className="w-4 h-4 text-brand-600 bg-black/50 border-brand-500/30 rounded focus:ring-brand-500 focus:ring-offset-0 cursor-pointer"
                      />
                    </div>
                    <label htmlFor="legal-agreement" className="text-sm text-brand-400/80 cursor-pointer select-none">
                      I acknowledge that I am solely responsible for complying with all applicable laws regarding the recording of conversations in my jurisdiction. I agree to the Terms of Service and Privacy Policy.
                    </label>
                  </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing || !isDisclaimerAccepted}
                    className="w-full bg-gradient-to-br from-brand-400 to-brand-600 text-black py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Start 3-Day Free Trial & Download
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setStep("selection")}
                    className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    Want to switch plans?
                  </button>
                </div>

                <p className="text-center text-xs text-gray-500">
                  Your payment is secured with 256-bit SSL encryption. We do not store your credit card details. Billing starts after your 3-day free trial ends. Cancel anytime.
                </p>
              </div>
            )}

            {step === "install" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Success!</h3>
                  <p className="text-gray-400">Your account has been created and subscription started.</p>
                </div>

                {/* Install/Open Button */}
                <div className="mb-8 p-6 bg-brand-600/10 border border-brand-500/20 rounded-xl text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Ready to Use</h3>
                  <p className="text-brand-200 mb-4 text-sm">
                    {deferredPrompt ? "Install the app for the best experience or open it now." : "You can now open the app directly."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {deferredPrompt && (
                      <button
                        onClick={handleInstallApp}
                        className="bg-gradient-to-br from-brand-400 to-brand-600 text-black px-6 py-3 rounded-full font-bold transition-all hover:scale-[1.05] shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Install App
                      </button>
                    )}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = "https://app.listening-project.app/";
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 border border-white/10"
                    >
                      <Smartphone className="w-5 h-5" />
                      Open Web App
                    </a>
                  </div>
                </div>

                {/* Manual Instructions Tabs - Only show if Auto */}
                {showTabs && (
                  <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveTab("android")}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "android" ? "bg-gradient-to-r from-brand-400 to-brand-600 text-black shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      Android
                    </button>
                    <button
                      onClick={() => setActiveTab("desktop")}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "desktop" ? "bg-gradient-to-r from-brand-400 to-brand-600 text-black shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      <Monitor className="w-4 h-4" />
                      Desktop
                    </button>
                  </div>
                )}

                {/* Instructions Content */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  {activeTab === "ios" && (
                    <div className="space-y-4 text-center">
                      <p className="text-gray-400">iOS version is coming soon.</p>
                    </div>
                  )}

                  {activeTab === "android" && (
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 font-bold text-brand-400">1</div>
                        <div>
                          <p className="text-white font-medium mb-1">Open Menu</p>
                          <p className="text-sm text-gray-400 flex items-center gap-2">
                            Tap the three dots <MoreVertical className="w-4 h-4 inline" /> in the top right of Chrome.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 font-bold text-brand-400">2</div>
                        <div>
                          <p className="text-white font-medium mb-1">Install App</p>
                          <p className="text-sm text-gray-400">
                            Tap "Install app" or "Add to Home screen".
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <a
                          href="https://play.google.com/store/apps"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-colors font-medium"
                        >
                          <Smartphone className="w-5 h-5" />
                          View on Google Play Store
                        </a>
                      </div>
                    </div>
                  )}

                  {activeTab === "desktop" && (
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 font-bold text-brand-400">1</div>
                        <div>
                          <p className="text-white font-medium mb-1">Check Address Bar</p>
                          <p className="text-sm text-gray-400 flex items-center gap-2">
                            Look for the install icon <Download className="w-4 h-4 inline" /> on the right side of the address bar in Chrome or Edge.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 font-bold text-brand-400">2</div>
                        <div>
                          <p className="text-white font-medium mb-1">Click Install</p>
                          <p className="text-sm text-gray-400">
                            Follow the prompt to install the app to your desktop.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
