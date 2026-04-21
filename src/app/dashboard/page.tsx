"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { RepoCard, RepoCardSkeleton } from "@/components/dashboard/RepoCard";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLang, setFilterLang] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch("/api/repos");
        const data = await res.json();
        if (Array.isArray(data)) {
          setRepos(data);
        }
      } catch (error) {
        console.error("Failed to fetch repos:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchRepos();
    }
  }, [session]);

  const filteredRepos = repos.filter((repo) => {
    const matchesSearch = repo.name.toLowerCase().includes(search.toLowerCase());
    const matchesLang = filterLang ? repo.language === filterLang : true;
    return matchesSearch && matchesLang;
  });

  const uniqueLanguages = Array.from(new Set(repos.map((r) => r.language).filter(Boolean)));

  return (
    <div className="flex-1 p-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Welcome back, @{session?.user?.name?.split(" ")[0].toLowerCase()} 👋
          </h1>
          <p className="text-secondary-foreground text-sm">
            Select a repository to generate or improve your README.
          </p>
        </div>
        
        {/* Mobile-only usage pill would go here, Sidebar handles desktop */}
        <div className="lg:hidden px-3 py-1.5 rounded-full bg-accent-light text-accent text-[11px] font-bold uppercase border border-accent/10">
          2 / 3 Generations Used
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" strokeWidth={1.5} />
          <Input 
            placeholder="Search repositories..." 
            className="pl-10 h-11 bg-white border-border focus:border-accent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline" }), "flex items-center cursor-pointer h-11 gap-2 border-border-strong px-4")}>
            <Filter className="w-4 h-4" strokeWidth={1.5} />
            {filterLang || "All Languages"}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setFilterLang(null)}>All Languages</DropdownMenuItem>
            {uniqueLanguages.map((lang) => (
              <DropdownMenuItem key={lang} onClick={() => setFilterLang(lang)}>
                {lang}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Repo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <RepoCardSkeleton key={i} />)
        ) : filteredRepos.length > 0 ? (
          filteredRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-text-disabled" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No repositories found</h3>
            <p className="text-secondary-foreground text-sm max-w-xs">
              {search 
                ? `We couldn't find any repos matching "${search}"`
                : "Your GitHub account doesn't seem to have any repositories yet."}
            </p>
            {search && (
              <Button 
                variant="link" 
                className="text-accent mt-2 p-0"
                onClick={() => setSearch("")}
              >
                Clear search filter
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
