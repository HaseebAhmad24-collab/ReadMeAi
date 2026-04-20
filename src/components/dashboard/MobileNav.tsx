"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Repos", href: "/dashboard", icon: LayoutDashboard },
  { name: "History", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 h-16 bg-white border border-border shadow-xl rounded-2xl flex items-center justify-around px-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all rounded-xl",
              isActive ? "text-accent" : "text-secondary-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive ? "fill-accent/10" : "")} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
