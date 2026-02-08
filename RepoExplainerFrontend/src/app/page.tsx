"use client";

import { Navbar } from "@/app/components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  GitBranch,
  MessageSquareCode,
  Zap,
  Terminal,
  Loader2,
  Sparkles,
  Search,
} from "lucide-react";
import api from "@/lib/axios";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // --- AUTH CHECK LOGIC ---
  useEffect(() => {
    const verifyUser = async () => {
      try {
        await api.get("/api/user/check-auth");
        router.replace("/chat");
      } catch (error) {
        setCheckingAuth(false);
      } finally {
        setCheckingAuth(false);
      }
    };
    verifyUser();
  }, [router]);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      localStorage.setItem("pendingRepoUrl", repoUrl);
      router.push("/auth/register");
    }
  };

  // --- LOADING STATE ---
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-gray-500 text-sm animate-pulse">
          Initializing RepoExplainer...
        </p>
      </div>
    );
  }

  // --- LANDING PAGE CONTENT ---
  return (
    <div className="min-h-screen bg-[#0d1117] font-sans text-white overflow-x-hidden selection:bg-blue-500/30">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20 px-4 md:pt-40 md:pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000 mix-blend-screen" />
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] animate-pulse-slow delay-500" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="tracking-wide">AI-POWERED CODE ANALYSIS</span>
          </div>

          {/* Main Title - UPDATED ANIMATION */}
          {/* Added 'zoom-in-50' for dramatic "inside" effect and 'duration-1000' for smoothness */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] animate-in fade-in zoom-in-50 slide-in-from-bottom-8 duration-1000 ease-out fill-mode-backwards">
            Chat with your <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent drop-shadow-sm">
              Codebase Instantly.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 px-4 fill-mode-backwards">
            Stop grepping through thousands of files. Paste a GitHub link and
            get an <span className="text-white font-medium">AI Architect</span>{" "}
            that maps your entire project context in seconds.
          </p>

          {/* INPUT FORM */}
          <div className="w-full max-w-xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 px-2 fill-mode-backwards">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

              <div className="relative bg-[#161b22]/90 backdrop-blur-xl border border-[#30363d] p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 transition-all">
                <form onSubmit={handleAnalyze} className="contents">
                  <div className="flex-1 relative flex items-center">
                    <div className="absolute left-4 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                      <Search size={20} />
                    </div>
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="github.com/username/repo"
                      className="w-full bg-transparent border-none outline-none text-white h-12 pl-12 pr-4 placeholder:text-gray-600 font-mono text-sm sm:text-base rounded-xl focus:bg-[#0d1117]/50 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!repoUrl.trim()}
                    className={`
                        h-12 sm:h-auto px-6 rounded-xl font-bold text-sm sm:text-base whitespace-nowrap flex items-center justify-center gap-2 transition-all duration-300 shadow-lg
                        ${
                          repoUrl.trim()
                            ? "bg-blue-600 hover:bg-blue-500 cursor-pointer text-white shadow-blue-500/20 hover:shadow-blue-500/40 translate-y-0"
                            : "bg-[#21262d] text-gray-500 cursor-not-allowed"
                        }
                      `}
                  >
                    Analyze <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            </div>

            {/* Quick Try Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs sm:text-sm text-gray-500">
              <span className="hidden sm:inline">Try popular repos:</span>
              <button
                onClick={() => setRepoUrl("https://github.com/rahim709/RepoExplainerFrontend")}
                className="cursor-pointer px-3 py-1.5 rounded-full bg-[#161b22] border border-[#30363d] hover:border-blue-500/50 hover:text-blue-300 hover:bg-blue-500/10 transition-all"
              >
                ⚛️ Abdur/RepoExplainer
              </button>
              <button
                onClick={() =>
                  setRepoUrl(
                    "https://github.com/ArpitKrSingh7/HumanActivityRecognition",
                  )
                }
                className="cursor-pointer px-3 py-1.5 rounded-full bg-[#161b22] border border-[#30363d] hover:border-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                ▲ Arpit/HumanActivityRecognition
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 px-4 relative bg-gradient-to-b from-[#0d1117] to-[#010409]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Built for engineers, by engineers
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We parse the Abstract Syntax Tree (AST) to ensure our AI
              understands the logic, not just the text.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              delay="0"
              icon={<GitBranch className="text-blue-400 w-8 h-8" />}
              title="Interactive Tree View"
              desc="Visualize file relationships instantly. Click any file to understand its purpose and dependencies without opening it."
              gradient="from-blue-500/10 to-transparent"
            />
            <FeatureCard
              delay="100"
              icon={<MessageSquareCode className="text-green-400 w-8 h-8" />}
              title="Context-Aware Chat"
              desc="Ask questions like 'Where is the auth logic?' or 'How do I add a new API route?' and get code-backed answers."
              gradient="from-green-500/10 to-transparent"
            />
            <FeatureCard
              delay="200"
              icon={<Zap className="text-purple-400 w-8 h-8" />}
              title="Instant Onboarding"
              desc="Reduce ramp-up time for new engineers from weeks to days. Generate docs, guides, and diagrams on the fly."
              gradient="from-purple-500/10 to-transparent"
            />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-32 px-4 relative overflow-hidden border-t border-[#30363d]/50">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-white/80 text-xs font-medium mb-4 uppercase tracking-wider">
              <Sparkles size={12} className="text-yellow-400" /> Workflow
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              From URL to Insight in Seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-blue-500/20 via-white/10 to-purple-500/20" />

            <Step
              num="01"
              title="Paste URL"
              desc="Simply drop any public GitHub repository link into the search bar."
              color="text-blue-400"
              border="group-hover:border-blue-500/50"
            />
            <Step
              num="02"
              title="AI Analysis"
              desc="Our engine maps the file structure and indexes code logic."
              color="text-green-400"
              border="group-hover:border-green-500/50"
            />
            <Step
              num="03"
              title="Start Chatting"
              desc="Ask complex questions and get answers grounded in truth."
              color="text-purple-400"
              border="group-hover:border-purple-500/50"
            />
          </div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <footer className="py-24 border-t border-[#30363d] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center px-4 relative z-10 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Ready to decode your repo?
          </h2>
          <p className="text-gray-400 text-lg">
            Join thousands of developers who are shipping faster with
            RepoExplainer.
          </p>
          <div className="flex justify-center pt-4">
            <button
              onClick={() => router.push("/auth/register")}
              className="cursor-pointer group relative px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </button>
          </div>

          <p className="text-gray-600 text-sm mt-12 pt-12 border-t border-[#30363d]/30">
            &copy; {new Date().getFullYear()} RepoExplainer. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// --- MODERN SUBCOMPONENTS ---

function FeatureCard({
  icon,
  title,
  desc,
  delay,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: string;
  gradient: string;
}) {
  return (
    <div
      className="group relative p-8 rounded-3xl bg-[#161b22]/50 backdrop-blur-sm border border-[#30363d] hover:border-[#58a6ff]/30 hover:bg-[#161b22] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br ${gradient} blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
      />

      <div className="relative z-10">
        <div className="mb-6 p-4 bg-[#0d1117] w-fit rounded-2xl border border-[#30363d] group-hover:scale-110 transition-transform duration-500 shadow-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-base leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Step({
  num,
  title,
  desc,
  color,
  border,
}: {
  num: string;
  title: string;
  desc: string;
  color: string;
  border: string;
}) {
  return (
    <div className="text-center relative group">
      <div
        className={`w-20 h-20 bg-[#0d1117] border border-[#30363d] ${border} rounded-2xl flex items-center justify-center mx-auto mb-8 text-2xl font-bold text-gray-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xl relative z-10`}
      >
        <span className={color}>{num}</span>
      </div>
      <h3
        className={`text-xl font-bold mb-3 ${color} brightness-90 group-hover:brightness-110 transition-all`}
      >
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed px-4 group-hover:text-gray-300 transition-colors">
        {desc}
      </p>
    </div>
  );
}