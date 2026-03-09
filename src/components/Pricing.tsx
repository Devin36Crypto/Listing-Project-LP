import { motion } from "motion/react";
import { Check, Smartphone, Calendar } from "lucide-react";

const plans = [
  {
    name: "Monthly",
    price: "$4",
    period: "/month",
    description: "Flexible billing. Cancel anytime.",
    features: [
      "3-Day Free Trial",
      "Web App Access",
      "Unlimited transcription",
      "Deep emotional analysis",
      "Real-time coaching",
      "Secure local storage",
      "High-fidelity audio"
    ],
    notIncluded: [],
    cta: "Start 3-Day Free Trial",
    popular: false,
    variant: "mobile",
    planId: "mobile-monthly"
  },
  {
    name: "Tablet",
    price: "$6",
    period: "/month",
    description: "Optimized for larger screens. Connect multiple devices.",
    features: [
      "3-Day Free Trial",
      "Web App Access",
      "Optimized for tablets",
      "Add devices for $5/mo each",
      "Split-screen multitasking",
      "Handwriting recognition",
      "Everything in Monthly"
    ],
    notIncluded: [],
    cta: "Start 3-Day Free Trial",
    popular: false,
    variant: "tablet",
    planId: "tablet-monthly"
  },
  {
    name: "Desktop",
    price: "$8",
    period: "/month",
    description: "Power user suite. Full desktop integration.",
    features: [
      "3-Day Free Trial",
      "Web App Access",
      "Optimized for desktop",
      "Add devices for $6/mo each",
      "Advanced export tools",
      "Unlimited local storage",
      "Everything in Tablet"
    ],
    notIncluded: [],
    cta: "Start 3-Day Free Trial",
    popular: false,
    variant: "desktop",
    planId: "desktop-monthly"
  },
  {
    name: "Annual",
    price: "$40",
    period: "/year",
    description: "Mobile: $40/yr. Tablet: $60/yr. Desktop: $80/yr.",
    features: [
      "3-Day Free Trial",
      "Web App Access",
      "Save ~17% on any plan",
      "Priority support",
      "Early access to new features",
      "2 months free"
    ],
    notIncluded: [],
    cta: "Start 3-Day Free Trial",
    popular: true,
    variant: "mobile",
    planId: "mobile-annual"
  }
];

interface PricingProps {
  onPlanSelect?: (variant: "auto" | "mobile" | "desktop" | "tablet", planId: string) => void;
}

export default function Pricing({ onPlanSelect }: PricingProps) {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Download for free. Try everything for 3 days. Then choose the plan that works for you.
          </p>

          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-2 text-brand-400 text-sm">
            <Smartphone className="w-4 h-4" />
            <span>One active device per subscription</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-3xl border flex flex-col ${plan.popular
                  ? "bg-white/10 border-brand-500/50 shadow-2xl shadow-brand-500/10"
                  : "bg-white/5 border-white/10 hover:bg-white/[0.07] transition-colors"
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-500 text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-brand-500/20">
                  Best Value
                </div>
              )}

              <div className="mb-8 text-center">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold font-display">{plan.price}</span>
                  <span className="text-gray-400 text-lg">{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm">
                  {plan.description}
                </p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                <div className="bg-brand-500/10 rounded-xl p-4 mb-6 border border-brand-500/20">
                  <div className="flex items-center gap-3 text-brand-400 font-medium">
                    <Calendar className="w-5 h-5" />
                    <span>3-Day Free Trial Included</span>
                  </div>
                  <p className="text-xs text-brand-400/70 mt-1 ml-8">
                    You won't be charged until your trial ends.
                  </p>
                </div>

                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-200">
                    <Check className="w-5 h-5 text-brand-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onPlanSelect?.(plan.variant as any, plan.planId)}
                className="w-full py-4 rounded-xl font-bold transition-all text-lg bg-brand-500 hover:bg-brand-600 text-black shadow-lg hover:shadow-brand-500/25"
              >
                {plan.cta}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Renews automatically. Cancel anytime.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
