"use client";

import { motion } from "framer-motion";
import { Search, Shield, FileText, Eye, Send, Globe } from "lucide-react";

const features = [
  {
    icon: <Search className="w-5 h-5 text-accent" />,
    title: "Smart Detection",
    description: "Automatically identifies languages, frameworks, and project structure.",
  },
  {
    icon: <Shield className="w-5 h-5 text-accent" />,
    title: "Auto Badges",
    description: "Generates status, license, and tech stack badges for your repo.",
  },
  {
    icon: <FileText className="w-5 h-5 text-accent" />,
    title: "Env Tracking",
    description: "Extracts environment variables from example files and documents them.",
  },
  {
    icon: <Eye className="w-5 h-5 text-accent" />,
    title: "Live Preview",
    description: "See rendered markdown changes in real-time as the AI generates.",
  },
  {
    icon: <Send className="w-5 h-5 text-accent" />,
    title: "One-Click Push",
    description: "Directly commit and push the README to your repository branch.",
  },
  {
    icon: <Globe className="w-5 h-5 text-accent" />,
    title: "Multi-Language",
    description: "Generate documentation in any language with Pro features.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Built for Developers</h2>
          <p className="text-secondary-foreground text-lg max-w-2xl mx-auto">
            Everything you need to showcase your code professionally without the manual grind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-8 bg-white border border-border rounded-xl shadow-sm hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-secondary-foreground text-[14px] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
