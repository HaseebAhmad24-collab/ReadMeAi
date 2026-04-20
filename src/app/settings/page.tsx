"use client";

import { useSession } from "next-auth/react";
import { 
  User, Mail, ShieldCheck, 
  Trash2, LogOut, Zap, Clock 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="flex-1 p-8 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Account Settings</h1>
        <p className="text-secondary-foreground text-sm">Manage your profile, usage, and account preferences.</p>
      </div>

      <div className="space-y-12">
        {/* Profile Section */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-secondary-foreground mb-6">Profile</h2>
          <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-6 mb-8">
              <Avatar className="w-16 h-16 border border-border shadow-sm">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold text-foreground">{session?.user?.name}</h3>
                <p className="text-sm text-secondary-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {session?.user?.email}
                </p>
              </div>
              <Badge className="ml-auto bg-success-light text-success border-success/10 gap-1.5 py-1 px-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Connected to GitHub
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-border">
                <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-secondary-foreground uppercase tracking-wider">GitHub Username</span>
                    <div className="flex items-center gap-2 text-sm font-mono text-foreground font-medium bg-secondary/50 p-2 rounded-lg border border-border">
                        <svg className="w-4 h-4 text-secondary-foreground" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                        {(session?.user as any)?.username || "haseebahmad24"}
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* Plan & Usage Section */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-secondary-foreground mb-6">Plan & Usage</h2>
          <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Free Plan</h3>
                    <p className="text-sm text-secondary-foreground">You are currently on the free-forever plan.</p>
                </div>
                <Button className="bg-accent hover:bg-accent-hover text-white gap-2 font-bold px-6">
                    <Zap className="w-4 h-4 fill-white" />
                    Upgrade to Pro
                </Button>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Monthly Generations</span>
                    <span className="text-xs font-bold text-secondary-foreground">2 of 3 used</span>
                </div>
                <Progress value={(2/3)*100} className="h-2 bg-border overflow-hidden" />
                <p className="text-[12px] text-secondary-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Limits will reset on May 1st, 2024.
                </p>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-error mb-6">Danger Zone</h2>
          <div className="border border-error/20 bg-error/5 rounded-xl p-8">
            <div className="flex items-center justify-between gap-12">
                <div>
                   <h3 className="text-base font-bold text-foreground mb-1">Delete Account</h3>
                   <p className="text-sm text-secondary-foreground">
                       Once you delete your account, all your generated README history will be permanently removed. This action cannot be undone.
                   </p>
                </div>
                
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="bg-error hover:bg-error/90 shrink-0 font-bold px-6">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl border-border">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-secondary-foreground">
                                This will permanently delete your ReadMeAI account and all associated data. You will need to re-authenticate with GitHub to use the service again.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-3">
                            <AlertDialogCancel className="rounded-xl border-border-strong font-bold">Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-error hover:bg-error/90 text-white rounded-xl font-bold">
                                Yes, Delete My Account
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
