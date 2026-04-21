"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Check, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get("url") || "https://github.com";
  useEffect(() => {
    // Tasteful confetti burst
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#2D6EF5", "#EEF3FF", "#16A34A"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#2D6EF5", "#EEF3FF", "#16A34A"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-6 bg-white">
      <div className="max-w-md w-full text-center">
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-20 h-20 rounded-full bg-success-light flex items-center justify-center mx-auto mb-8 border-4 border-success/10"
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
          >
            <Check className="w-10 h-10 text-success" strokeWidth={3} />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-foreground mb-4 tracking-tight"
        >
          README pushed successfully! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-secondary-foreground text-lg mb-10"
        >
          Your documentation is now live in your repository. Go check it out!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full bg-accent hover:bg-accent-hover text-white h-12 rounded-xl font-bold gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              View on GitHub
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
          
          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full h-12 rounded-xl font-bold gap-2 border-border-strong hover:bg-secondary">
                    <Home className="w-4 h-4" />
                    Dashboard
                </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
                <Button variant="ghost" className="w-full h-12 rounded-xl font-bold hover:bg-secondary">
                    Generate Another
                </Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Miniature Preview Mockup */}
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-16 p-4 bg-secondary/50 border border-border rounded-xl opacity-60 grayscale hover:grayscale-0 transition-all duration-500 cursor-default"
        >
            <div className="flex items-center gap-2 mb-3 border-b border-border pb-2">
                <div className="w-2 h-2 rounded-full bg-border-strong" />
                <div className="w-2 h-2 rounded-full bg-border-strong" />
                <div className="w-2 h-2 rounded-full bg-border-strong" />
                <span className="text-[10px] uppercase font-mono ml-auto">README.md</span>
            </div>
            <div className="space-y-2">
                <div className="h-2 w-3/4 bg-border-strong rounded" />
                <div className="h-2 w-full bg-border-strong rounded" />
                <div className="h-2 w-1/2 bg-border-strong rounded" />
            </div>
        </motion.div>
      </div>
    </div>
  );
}
