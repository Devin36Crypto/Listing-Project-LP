import { motion, AnimatePresence } from "motion/react";
import { X, Smartphone, Monitor, Download, MoreVertical, Tablet, CreditCard, Check, ChevronDown, Lock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase, recordDownload } from "../services/supabase";
import { Purchases } from "@revenuecat/purchases-js";

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
  const [step, setStep] = useState<"selection" | "payment" | "install">("selection");
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
        setStep("payment");
      } else {
        setStep("selection");
        setSelectedPlanId(plans[0].id);
      }
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

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      if (isLoginMode) {
        // Login Logic
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        
        // On success, just close (App.tsx handles session state)
        onClose();
      } else {
        // Signup & Payment Logic
        // 1. Create Supabase User
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        // 2. Identify in RevenueCat (if we had a user ID)
        if (authData.user) {
           try {
             const apiKey = import.meta.env.VITE_REVENUECAT_PUBLIC_API_KEY;
             if (apiKey) {
               Purchases.configure(apiKey, authData.user.id);
               // In a real scenario, we would trigger the purchase flow here.
               // For now, we simulate success as it's a "Free Trial" or demo.
             }
           } catch (rcError) {
             console.warn("RevenueCat config error", rcError);
           }
        }

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Record download with detected platform
        const platform = activeTab === 'ios' ? 'ios' : activeTab === 'android' ? 'android' : 'desktop';
        recordDownload(platform);

        setStep("install");
      }
    } catch (err: any) {
      console.error("Auth/Payment error:", err);
      setError(err.message || "An error occurred.");
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
              <h2 className="text-xl font-bold font-display">
                {step === "install" ? "Install Listening Project" : (isLoginMode ? "Log In" : "Select Plan & Download")}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            
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
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPlanId === plan.id 
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
                    onClick={() => setStep("payment")}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                    >
                    Continue to Payment <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                    </button>
                    
                    <button
                        onClick={() => { setIsLoginMode(true); setStep("payment"); }}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Already have an account? Log in
                    </button>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-6">
                {!isLoginMode && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 cursor-pointer hover:text-white" onClick={() => setStep("selection")}>
                    <ChevronDown className="w-4 h-4 rotate-90" /> Back to plans
                    </div>
                )}

                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand-400" />
                    {isLoginMode ? "Log In" : "Create Account & Secure Payment"}
                  </h3>
                  
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                      <div className="relative">
                        <input 
                          type="password" 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                          placeholder={isLoginMode ? "Enter your password" : "Create a password"}
                        />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      </div>
                    </div>

                    {!isLoginMode && (
                        <div className="border-t border-white/10 my-4 pt-4">
                            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Payment Details</p>
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
                    )}
                  </div>
                </div>

                {!isLoginMode && (
                    <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4 flex items-start gap-3">
                    <div className="flex items-center h-5 mt-0.5">
                        <input
                        id="legal-agreement"
                        type="checkbox"
                        checked={isDisclaimerAccepted}
                        onChange={(e) => setIsDisclaimerAccepted(e.target.checked)}
                        className="w-4 h-4 text-brand-600 bg-black/50 border-gray-500 rounded focus:ring-brand-500 focus:ring-offset-0 cursor-pointer"
                        />
                    </div>
                    <label htmlFor="legal-agreement" className="text-sm text-gray-300 cursor-pointer select-none">
                        I acknowledge that I am solely responsible for complying with all applicable laws regarding the recording of conversations in my jurisdiction. I agree to the Terms of Service and Privacy Policy.
                    </label>
                    </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={isProcessing || (!isLoginMode && !isDisclaimerAccepted) || !email || !password}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
                >
                  {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                  ) : (
                    <>
                      {isLoginMode ? (
                          "Log In"
                      ) : (
                          <>
                            <Download className="w-5 h-5" />
                            Start 3-Day Free Trial & Download
                          </>
                      )}
                    </>
                  )}
                </button>
                
                {!isLoginMode && (
                    <p className="text-center text-xs text-gray-500">
                    Your payment is secured with 256-bit SSL encryption. We do not store your credit card details. Billing starts after your 3-day free trial ends. Cancel anytime.
                    </p>
                )}

                <div className="text-center mt-4">
                    <button
                        onClick={() => {
                            setIsLoginMode(!isLoginMode);
                            setError(null);
                        }}
                        className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
                    >
                        {isLoginMode ? "Need an account? Sign up" : "Already have an account? Log in"}
                    </button>
                </div>
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

                {/* Install Button (if supported) */}
                {deferredPrompt && (
                  <div className="mb-8 p-6 bg-brand-600/10 border border-brand-500/20 rounded-xl text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">App Available</h3>
                    <p className="text-brand-200 mb-4 text-sm">
                      Install the full Progressive Web App for the best experience.
                    </p>
                    <button
                      onClick={handleInstallApp}
                      className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 mx-auto w-full sm:w-auto"
                    >
                      <Download className="w-5 h-5" />
                      Install App Now
                    </button>
                  </div>
                )}

                {/* Manual Instructions Tabs - Only show if Auto */}
                {showTabs && (
                  <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveTab("android")}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        activeTab === "android" ? "bg-brand-600 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      Android
                    </button>
                    <button
                      onClick={() => setActiveTab("desktop")}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        activeTab === "desktop" ? "bg-brand-600 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"
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
