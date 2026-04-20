"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function Hero() {
  return (
    <section className="relative pt-[156px] pb-20 overflow-hidden dot-grid">
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-medium mb-6 border border-accent/10"
        >
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>AI-Powered README Generator</span>
        </motion.div>

        {/* H1 Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[48px] md:text-[64px] font-bold text-foreground leading-[1.1] mb-6 tracking-tight max-w-4xl mx-auto"
        >
          Your code deserves a <br className="hidden md:block" />
          <span className="text-accent underline decoration-accent/20 underline-offset-8">better README</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-secondary-foreground max-w-2xl mx-auto mb-10"
        >
          Connect GitHub. Pick a repo. Done in 30 seconds.
          Professional, structured, and developer-centric documentation auto-pushed to your repo.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => signIn("github")}
            className="bg-accent hover:bg-accent-hover text-white h-[52px] px-8 rounded-xl font-medium text-base group"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="text-[13px] text-secondary-foreground font-normal">
            No credit card required • Free forever plan
          </p>
        </motion.div>
      </div>

      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
