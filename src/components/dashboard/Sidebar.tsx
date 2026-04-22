"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, LayoutDashboard, History, Settings, LogOut, Zap } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const navItems = [
  { name: "My Repos", href: "/dashboard", icon: LayoutDashboard },
  { name: "History", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ userPlan = "free", usageCount = 0 }: { userPlan?: string; usageCount?: number }) {
  const pathname = usePathname();
  const { data: session } = useSession() as any;
  const isAdmin = session?.user?.role === "admin";
  const plan = isAdmin ? "admin" : userPlan;

  return (
    <aside className="w-[240px] fixed top-0 left-0 bottom-0 bg-white border-r border-border flex flex-col z-40 hidden lg:flex">
      {/* Logo Area */}
      <div className="h-[60px] px-6 flex items-center border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-accent" strokeWidth={1.5} />
          <span className="font-semibold text-lg tracking-tight">ReadMeAI</span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-accent-light text-accent border-l-2 border-accent rounded-l-none"
                      : "text-secondary-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-accent" : "text-secondary-foreground group-hover:text-foreground")} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Usage Pill (Simplified for now) */}
      <div className="px-6 py-4 flex flex-col gap-3">
        <div className="p-4 rounded-xl bg-secondary border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Usage</span>
          </div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-secondary-foreground font-medium">
              {isAdmin ? "Unlimited access" : `${usageCount} / 3 used`}
            </span>
            <span className="text-[10px] font-bold text-accent uppercase">{plan}</span>
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-500", isAdmin ? "bg-accent w-full" : "bg-accent")} 
              style={!isAdmin ? { width: `${(usageCount / 3) * 100}%` } : undefined}
            />
          </div>
        </div>
        
        {/* Upgrade to Pro Button */}
        {!isAdmin && (
          <button 
            onClick={() => toast("Pro features are currently in testing! 🚀", {
              description: "We'll let you know as soon as the upgraded plans are available."
            })}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-accent to-accent-hover text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            Upgrade to Pro
          </button>
        )}
      </div>

      {/* User Area */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-9 h-9 border border-border">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{session?.user?.name}</p>
            <p className="text-[11px] text-secondary-foreground uppercase font-bold tracking-tight">{plan} Plan</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-secondary-foreground hover:text-error hover:bg-error/5 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
