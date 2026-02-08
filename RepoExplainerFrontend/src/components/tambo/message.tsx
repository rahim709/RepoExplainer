"use client";

import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Bot, Cpu, Layers, Activity, GitGraph } from "lucide-react";

export interface MessageProps {
  role: "user" | "assistant" | "model";
  content: string;
  isLoading?: boolean;
  uiComponent?: string;
  uiData?: any;
}

export function Message({ role, content, isLoading, uiComponent, uiData }: MessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
        // UPDATE: Added 'pr-[30px]' here to push the user bubble 30px from the right
        isUser ? "justify-end pr-[100px]" : "justify-start"
      )}
    >
      {/* Avatar (AI Only, sits outside bubble) */}
      {!isUser && (
        <div className="w-8 h-8 mr-3 rounded-full bg-[#1f6feb] flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 mt-1">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      {/* The Bubble */}
      <div
        className={cn(
          "relative px-5 py-3.5 max-w-[85%] md:max-w-[75%] rounded-2xl shadow-sm text-sm leading-relaxed",
          isUser
            ? "bg-[#1f6feb] text-white rounded-tr-sm" // User: Blue, Sharp top-right corner
            : "bg-[#161b22] border border-[#30363d] text-[#c9d1d9] rounded-tl-sm" // AI: Dark Grey, Sharp top-left
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 text-[#8b949e]">
            <span className="text-xs font-medium">Analyzing...</span>
            <span className="w-1.5 h-1.5 bg-[#8b949e] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-[#8b949e] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-[#8b949e] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        ) : (
          <div className={cn("prose max-w-none break-words", isUser ? "prose-invert text-white" : "prose-invert text-[#c9d1d9]")}>
            
            {/* 1. CHECK: Is this the special Project Summary Card? */}
            {uiComponent === "ProjectSummaryCard" && uiData ? (
              <div className="mt-1 space-y-4 min-w-[300px]">
                
                {/* Header Card */}
                <div className="p-4 rounded-md bg-[#0d1117] border border-[#30363d] shadow-sm">
                  <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                    <GitGraph className="w-5 h-5 text-[#238636]" />
                    {uiData.projectName}
                  </h3>
                  <p className="text-[#8b949e] italic text-xs mb-3">Complexity: {uiData.complexity}</p>
                  <p className="text-[#c9d1d9]">{uiData.summary}</p>
                </div>

                {/* Tech Stack Grid */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 rounded-md bg-[#0d1117] border border-[#30363d]">
                    <h4 className="text-xs font-bold text-[#8b949e] uppercase mb-2 flex items-center gap-2">
                      <Cpu className="w-4 h-4" /> Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {uiData.techStack?.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-[#1f6feb]/10 text-[#58a6ff] border border-[#1f6feb]/20 text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-md bg-[#0d1117] border border-[#30363d]">
                    <h4 className="text-xs font-bold text-[#8b949e] uppercase mb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4" /> Architecture
                    </h4>
                    <p className="text-xs text-[#c9d1d9] font-semibold mb-1">{uiData.architecture?.style}</p>
                    <p className="text-xs text-[#8b949e] leading-snug">{uiData.architecture?.explanation}</p>
                  </div>
                </div>
              </div>
            ) : (
              /* 2. ELSE: Render Standard Markdown */
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                      return !inline ? (
                        <div className="my-2 bg-black/30 rounded-md p-3 overflow-x-auto border border-white/10">
                           <code className="text-xs font-mono text-white" {...props}>{children}</code>
                        </div>
                      ) : (
                        <code className="bg-black/20 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
                      )
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            )}

          </div>
        )}
      </div>
    </div>
  );
}