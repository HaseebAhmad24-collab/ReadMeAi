"use client";

import { Calendar, CheckCircle2, ExternalLink, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HistoryItemProps {
  generation: {
    id: string;
    repo_name: string;
    repo_url: string;
    readme_content: string;
    pushed_at: string | null;
    created_at: string;
  };
}

export function HistoryItem({ generation }: HistoryItemProps) {
    const date = new Date(generation.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
    const time = new Date(generation.created_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });

    return (
        <div className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-all duration-200 group flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <svg className="w-5 h-5 text-secondary-foreground" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                </div>
                <div>
                   <h3 className="font-bold text-foreground leading-none">{generation.repo_name}</h3>
                   <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-[11px] text-secondary-foreground font-medium">
                            <Calendar className="w-3 h-3 text-accent" strokeWidth={2} />
                            {date}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-secondary-foreground font-medium">
                            <Clock className="w-3 h-3 text-accent" strokeWidth={2} />
                            {time}
                        </div>
                   </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end gap-1.5">
                    {generation.pushed_at ? (
                        <Badge variant="outline" className="bg-success-light text-success border-success/10 gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase transition-all">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Pushed
                        </Badge>
                    ) : (
                         <Badge variant="outline" className="bg-secondary text-secondary-foreground border-border rounded-full px-2 py-0.5 text-[10px] font-bold uppercase">
                            Generated
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-9 px-3 gap-2 text-xs font-semibold hover:bg-secondary rounded-lg">
                        View
                    </Button>
                    <a href={generation.repo_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-border hover:bg-secondary">
                            <ExternalLink className="w-3.5 h-3.5 text-secondary-foreground" />
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
}

export function HistoryItemSkeleton() {
    return (
        <div className="bg-white border border-border rounded-xl p-5 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary" />
                <div className="space-y-2">
                    <div className="w-32 h-4 bg-secondary rounded" />
                    <div className="w-24 h-3 bg-secondary rounded" />
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="w-16 h-5 bg-secondary rounded-full" />
                <div className="flex gap-2">
                    <div className="w-16 h-9 bg-secondary rounded-lg" />
                    <div className="w-9 h-9 bg-secondary rounded-lg" />
                </div>
            </div>
        </div>
    );
}
