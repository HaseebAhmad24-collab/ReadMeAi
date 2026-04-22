"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for individuals and small projects.",
    features: [
      { name: "3 README generations / month", included: true },
      { name: "Public repository scanning", included: true },
      { name: "Standard AI Model", included: true },
      { name: "One-click GitHub push", included: true },
      { name: "Private repo support", included: false },
      { name: "Multi-language README", included: false },
    ],
    cta: "Start for Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    description: "For serious developers and teams.",
    features: [
      { name: "Unlimited generations", included: true },
      { name: "Private repository support", included: true },
      { name: "Advanced Claude-3 Model", included: true },
      { name: "Multi-language support", included: true },
      { name: "Custom README templates", included: true },
      { name: "Priority Support", included: true },
    ],
    cta: "Get Started",
    popular: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-secondary-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that's right for your development workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border ${
                plan.popular ? "border-accent shadow-md ring-1 ring-accent/10" : "border-border shadow-sm"
              } bg-white flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-secondary-foreground text-sm font-medium">/month</span>
                </div>
                <p className="mt-4 text-secondary-foreground text-[14px]">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-success mt-0.5" strokeWidth={2.5} />
                    ) : (
                      <X className="w-4 h-4 text-text-disabled mt-0.5" strokeWidth={2.5} />
                    )}
                    <span className={`text-[14px] ${feature.included ? "text-secondary-foreground" : "text-text-disabled"}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() =>
                  plan.popular
                    ? toast("Pro features are currently in testing! 🚀", {
                        description: "We'll notify you as soon as Pro plans are live. Stay tuned!",
                      })
                    : signIn("github")
                }
                className={`w-full h-11 rounded-xl font-medium transition-all ${
                  plan.popular
                    ? "bg-accent hover:bg-accent-hover text-white"
                    : "bg-white border border-border-strong text-foreground hover:bg-secondary"
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
