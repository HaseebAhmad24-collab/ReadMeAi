"use client";

import { Lock, Star, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RepoCardProps {
  repo: {
    id: number;
    name: string;
    description: string | null;
    language: string | null;
    stars: number;
    updated_at: string | null;
    private: boolean;
    html_url: string;
    has_readme?: boolean;
    status?: "no-readme" | "has-readme" | "generated";
  };
}

export function RepoCard({ repo }: RepoCardProps) {
  const lastUpdated = repo.updated_at 
    ? new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Recently";

  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200 group flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground text-base tracking-tight truncate line-clamp-1 max-w-[180px]">
            {repo.name}
          </h3>
          {repo.private && <Lock className="w-3 h-3 text-secondary-foreground" />}
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary border border-border text-[11px] font-medium text-secondary-foreground">
          <Star className="w-3 h-3" />
          {repo.stars}
        </div>
      </div>

      <p className="text-secondary-foreground text-[13px] leading-relaxed mb-6 line-clamp-2 min-h-[40px]">
        {repo.description || "No description provided."}
      </p>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-[12px] font-medium text-secondary-foreground">{repo.language}</span>
              </div>
            )}
            <span className="text-[12px] text-text-disabled">·</span>
            <span className="text-[12px] text-text-disabled">Updated {lastUpdated}</span>
          </div>

          {/* Status Badge */}
          <Badge 
            variant="outline" 
            className={cn(
              "rounded-full px-2 py-0 text-[10px] uppercase tracking-wider font-bold",
              repo.has_readme 
                ? "bg-accent/10 border-accent/20 text-accent" 
                : "border-border/50 text-secondary-foreground"
            )}
          >
            {repo.has_readme ? "Ready" : "No README"}
          </Badge>
        </div>

        <Link href={`/generate/${repo.name}`} className="block">
          <Button className="w-full bg-accent hover:bg-accent-hover text-white rounded-lg h-9 text-sm font-medium gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Generate README
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function RepoCardSkeleton() {
  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm h-[220px] animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-32 h-5 bg-secondary rounded" />
        <div className="w-12 h-5 bg-secondary rounded-full" />
      </div>
      <div className="space-y-2 mb-6">
        <div className="w-full h-4 bg-secondary rounded" />
        <div className="w-2/3 h-4 bg-secondary rounded" />
      </div>
      <div className="mt-auto space-y-4">
        <div className="flex justify-between">
          <div className="w-24 h-4 bg-secondary rounded" />
          <div className="w-16 h-4 bg-secondary rounded-full" />
        </div>
        <div className="w-full h-9 bg-secondary rounded-lg" />
      </div>
    </div>
  );
}
