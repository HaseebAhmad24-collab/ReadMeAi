"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, CheckCircle2, Circle, 
  Loader2, RefreshCcw, Send, Eye, Edit3, Rocket 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { Typewriter } from "@/components/generate/Typewriter";
import Link from "next/link";

type Step = "scanning" | "generating" | "preview" | "pushing";

export default function GeneratePage() {
  const { repoName } = useParams();
  const router = useRouter();
  const [step, setStep] = useState<Step>("scanning");
  const [scanData, setScanData] = useState<any>(null);
  const [readme, setReadme] = useState("");
  const [progress, setProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState(0);
  const [scanningFiles, setScanningFiles] = useState<string[]>([]);
  
  // SCANNING LOGIC
  useEffect(() => {
    async function startScan() {
      try {
        const res = await fetch("/api/repos/scan", {
          method: "POST",
          body: JSON.stringify({ repoName }),
        });
        const data = await res.json();
        setScanData(data);
        
        // Mock scan animations
        const files = ["package.json", "src/index.ts", ".env.example", "Dockerfile", "README.md"];
        for(let i = 0; i < files.length; i++) {
          setScanningFiles(prev => [...prev, files[i]]);
          setScanPhase(i + 1);
          await new Promise(r => setTimeout(r, 600));
        }

        setStep("generating");
      } catch (error) {
        console.error("Scan failed:", error);
      }
    }
    startScan();
  }, [repoName]);

  // GENERATION LOGIC
  useEffect(() => {
    if (step === "generating") {
      let p = 0;
      const interval = setInterval(() => {
        p += 2;
        if (p <= 98) setProgress(p);
      }, 100);

      async function generate() {
        try {
          const res = await fetch("/api/readme/generate", {
            method: "POST",
            body: JSON.stringify({ scanData }),
          });
          const data = await res.json();
          setReadme(data.readme);
          setProgress(100);
          setTimeout(() => setStep("preview"), 500);
        } catch (error) {
          console.error("Generation failed:", error);
        }
      }
      generate();
      return () => clearInterval(interval);
    }
  }, [step, scanData]);

  const handlePush = async () => {
    setStep("pushing");
    try {
      const res = await fetch("/api/readme/push", {
        method: "POST",
        body: JSON.stringify({ repoName, content: readme }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/success");
      }
    } catch (error) {
      console.error("Push failed:", error);
      setStep("preview");
    }
  };

  return (
    <div className="flex h-[calc(100vh-60px)] lg:ml-0 bg-white border-t border-border">
      {/* LEFT PANEL: Scan Status (40%) */}
      <div className="w-[40%] border-r border-border p-8 flex flex-col bg-secondary/30">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <span className="font-mono text-sm font-semibold">{repoName}</span>
          </div>
        </div>

        <div className="flex-1 space-y-12">
          {/* Phase 1: Scanning */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-secondary-foreground">Phase 1: Analysis</h3>
              {step !== "scanning" ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Loader2 className="w-4 h-4 text-accent animate-spin" />}
            </div>
            <div className="space-y-3">
              {["Reading codebase", "Identifying tech stack", "Analyzing dependencies", "Detecting environment variables"].map((label, i) => (
                <div key={i} className="flex items-center gap-3">
                  {scanPhase > i ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Circle className="w-4 h-4 text-border" />}
                  <span className={`text-sm ${scanPhase > i ? "text-foreground font-medium" : "text-text-disabled"}`}>{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 font-mono text-[11px] text-accent p-3 bg-accent-light rounded-lg border border-accent/10 whitespace-pre h-24 overflow-hidden shadow-inner">
              {scanningFiles.map((f, i) => <div key={i}>SCAN: {f} ... OK</div>)}
              {step === "scanning" && <div className="animate-pulse">_</div>}
            </div>
          </section>

          {/* Phase 2: Generation */}
          <section className={step === "scanning" ? "opacity-30" : "opacity-100"}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-secondary-foreground">Phase 2: AI Generation</h3>
              {step === "preview" ? <CheckCircle2 className="w-4 h-4 text-success" /> : step === "generating" ? <Loader2 className="w-4 h-4 text-accent animate-spin" /> : <Circle className="w-4 h-4 text-border" />}
            </div>
            <div className="space-y-4">
              <p className="text-sm text-secondary-foreground">Crafting your README using Claude 3.5 Sonnet...</p>
              <Progress value={progress} className="h-1.5 bg-border" />
              <div className="flex justify-between text-[11px] font-mono text-secondary-foreground">
                <span>{progress}% COMPLETE</span>
                <span>{step === "generating" ? "PROCESSING" : step === "preview" ? "FINISHED" : "WAITING"}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* RIGHT PANEL: Live Preview (60%) */}
      <div className="w-[60%] flex flex-col bg-white relative">
        {step === "scanning" || step === "generating" && !readme ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-accent-light border-t-accent animate-spin mb-6" />
            <h2 className="text-xl font-bold mb-2 tracking-tight">Hang tight, we're working on it</h2>
            <p className="text-secondary-foreground max-w-sm">
              Our AI is analyzing your code and writing professional documentation. This usually takes around 20-30 seconds.
            </p>
          </div>
        ) : (
          <>
            <Tabs defaultValue="preview" className="flex-1 flex flex-col">
              <div className="h-[60px] px-6 border-b border-border flex items-center justify-between bg-white sticky top-0 z-10">
                <TabsList className="bg-secondary p-1 h-9 rounded-lg">
                  <TabsTrigger value="preview" className="rounded-md px-4 gap-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="edit" className="rounded-md px-4 gap-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="h-9 gap-2 text-xs font-semibold" onClick={() => window.location.reload()}>
                    <RefreshCcw className="w-3.5 h-3.5" />
                    Regenerate
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-9 bg-accent hover:bg-accent-hover text-white gap-2 px-5 font-bold text-xs rounded-lg shadow-md transition-all active:scale-95"
                    disabled={step === "pushing"}
                    onClick={handlePush}
                  >
                    {step === "pushing" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Rocket className="w-3.5 h-3.5" />
                    )}
                    Push to GitHub
                  </Button>
                </div>
              </div>

              <TabsContent value="preview" className="flex-1 overflow-y-auto p-12 m-0 bg-white">
                <div className="max-w-[700px] mx-auto">
                    {step === "preview" ? (
                      <div className="prose prose-sm max-w-none prose-headings:tracking-tight prose-headings:font-bold prose-a:text-accent">
                        <ReactMarkdown>{readme}</ReactMarkdown>
                      </div>
                    ) : (
                      <Typewriter content={readme} />
                    )}
                </div>
              </TabsContent>

              <TabsContent value="edit" className="flex-1 m-0">
                <Textarea 
                  className="w-full h-full p-12 font-mono text-[14px] leading-relaxed border-none focus:ring-0 resize-none bg-white"
                  value={readme}
                  onChange={(e) => setReadme(e.target.value)}
                  placeholder="The generated README will appear here..."
                />
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Floating Success Indicator */}
        {step === "preview" && (
          <div className="absolute bottom-10 right-10 bg-success text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-bounce flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            READY TO PUSH
          </div>
        )}
      </div>
    </div>
  );
}
