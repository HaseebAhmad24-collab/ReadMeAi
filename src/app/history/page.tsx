"use client";

import { useEffect, useState } from "react";
import { History, Search, Filter } from "lucide-react";
import { HistoryItem, HistoryItemSkeleton } from "@/components/history/HistoryItem";
import { Input } from "@/components/ui/input";

export default function HistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await fetch("/api/history");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setHistory(data);
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, []);

    const filteredHistory = history.filter(item => 
        item.repo_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex-1 p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <History className="w-4 h-4 text-accent" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Generation History</h1>
                </div>
                <p className="text-secondary-foreground text-sm">
                    View and manage your previously generated README documentations.
                </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" strokeWidth={1.5} />
                    <Input 
                        placeholder="Search history by repo name..." 
                        className="pl-10 h-11 bg-white border-border focus:border-accent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* History List */}
            <div className="space-y-4">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <HistoryItemSkeleton key={i} />)
                ) : filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                        <HistoryItem key={item.id} generation={item} />
                    ))
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center bg-secondary/20 rounded-2xl border border-dashed border-border">
                        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                            <History className="w-8 h-8 text-text-disabled" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">No history records</h3>
                        <p className="text-secondary-foreground text-sm max-w-xs">
                            {search 
                                ? `No generations found matching "${search}"`
                                : "You haven't generated any READMEs yet. Go to your dashboard to get started!"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
