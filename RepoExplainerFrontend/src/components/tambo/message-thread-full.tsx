"use client";

import * as React from "react";
import {
  Send,
  Paperclip,
  Bot,
  User,
  Terminal,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import { ChatMessage } from "@/hooks/useRepoChat";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageThreadProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: ChatMessage[];
  isLoading: boolean;
  onChatStart: (url: string) => void;
  onSendMessage: (msg: string) => void;
}

// --- SUBCOMPONENT: COPY BUTTON ---
function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 text-gray-400 hover:text-white hover:bg-[#30363d] rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
      title="Copy message"
    >
      {isCopied ? (
        <Check size={14} className="text-green-400" />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );
}

export const MessageThreadFull = React.forwardRef<
  HTMLDivElement,
  MessageThreadProps
>(
  (
    { className, messages, isLoading, onChatStart, onSendMessage, ...props },
    ref,
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
      }
    }, [inputValue]);

    const handleAnalyzeClick = () => {
      if (!inputValue.trim() || isLoading) return;
      if (!inputValue.includes("github.com")) {
        toast.error("Please paste a valid GitHub repository URL first.");
        return;
      }
      onChatStart(inputValue);
      setInputValue("");
    };

    const handleChatClick = () => {
      if (!inputValue.trim() || isLoading) return;
      onSendMessage(inputValue);
      setInputValue("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    };

    const handleKeyDown = (e: React.KeyboardEvent, isHero: boolean) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        isHero ? handleAnalyzeClick() : handleChatClick();
      }
    };

    // --- VIEW 1: NEW CHAT STATE (Hero - Responsive) ---
    if (messages.length === 0 && !isLoading) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-col items-center justify-center h-full w-full bg-[#0d1117] p-4 sm:p-8 animate-in fade-in zoom-in duration-300",
            className,
          )}
          {...props}
        >
          <div className="text-center space-y-6 mb-8 md:mb-10 max-w-2xl w-full pt-12 md:pt-0">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center shadow-2xl relative group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse group-hover:bg-blue-500/30 transition-all" />
              <Bot className="w-8 h-8 md:w-10 md:h-10 text-gray-200 relative z-10" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white px-2">
              Start a new analysis
            </h2>
            <p className="text-[#8b949e] text-base md:text-lg leading-relaxed px-4">
              Paste a GitHub repository URL below to inspect its architecture,
              ask questions, and understand the code.
            </p>
          </div>

          <div className="w-full max-w-xl relative group z-10 px-2">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-[#161b22] border border-[#30363d] rounded-xl md:rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
              <div className="hidden sm:flex pl-4 text-[#8b949e]">
                <Terminal size={20} />
              </div>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, true)}
                autoFocus
                placeholder="github.com/username/repo"
                className="flex-1 bg-transparent border-none outline-none text-white h-12 px-4 sm:px-2 placeholder:text-gray-600 font-mono text-sm md:text-base w-full"
              />
              <button
                onClick={handleAnalyzeClick}
                disabled={!inputValue.trim()}
                className={cn(
                  "h-10 md:h-12 px-6 rounded-lg md:rounded-xl font-medium transition-all flex items-center justify-center gap-2 w-full sm:w-auto",
                  inputValue.trim()
                    ? "bg-[#238636] text-white hover:bg-[#2ea043] shadow-lg hover:shadow-green-900/20"
                    : "bg-[#21262d] text-gray-500 cursor-not-allowed",
                )}
              >
                Analyze <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="mt-8 md:mt-10 flex flex-wrap justify-center gap-2 md:gap-3 text-xs md:text-sm text-[#8b949e] px-4">
            <span className="py-1 w-full text-center sm:w-auto">
              Try popular repos:
            </span>
            <button
              onClick={() => onChatStart("https://github.com/rahim709/RepoExplainerFrontend")}
              className="cursor-pointer px-3 py-1 rounded-full border border-[#30363d] hover:border-blue-500/50 hover:text-blue-400 hover:bg-[#1f6feb]/10 transition-colors"
            >
              Abdur/RepoExplainer
            </button>
            <button
              onClick={() =>
                onChatStart(
                  "https://github.com/ArpitKrSingh7/HumanActivityRecognition",
                )
              }
              className="cursor-pointer px-3 py-1 rounded-full border border-[#30363d] hover:border-blue-500/50 hover:text-blue-400 hover:bg-[#1f6feb]/10 transition-colors"
            >
              Arpit/HumanActivityRecognition
            </button>
          </div>
        </div>
      );
    }

    // --- VIEW 2: ACTIVE CHAT STATE (Responsive) ---
    return (
      <div
        ref={ref}
        className={cn("flex flex-col h-full w-full bg-[#0d1117]", className)}
        {...props}
      >
        {/* ADDED pt-16 FOR MOBILE TO AVOID MENU OVERLAP */}
        <ScrollableMessageContainer className="flex-1 p-4 pt-16 md:p-6 md:pt-6 space-y-6 md:space-y-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex w-full gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-2 group",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {/* AI Avatar */}
              {msg.role !== "user" && (
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#1f6feb]/10 border border-[#1f6feb]/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot size={14} className="text-[#58a6ff] md:w-4 md:h-4" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={cn(
                  "relative px-4 py-3 md:px-6 md:py-4 max-w-[90%] md:max-w-[75%] rounded-2xl text-sm leading-relaxed shadow-sm overflow-hidden",
                  msg.role === "user"
                    ? "bg-[#1f6feb] text-white rounded-tr-none"
                    : "bg-[#161b22] border border-[#30363d] text-[#e6edf3] rounded-tl-none",
                )}
              >
                {/* Copy Button */}
                <div
                  className={cn(
                    "absolute top-2 right-2 z-10",
                    msg.role === "user" ? "text-white/70" : "text-gray-400",
                  )}
                >
                  <CopyButton text={msg.content} />
                </div>

                {/* MARKDOWN RENDERER */}
                <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-[#30363d] prose-pre:rounded-lg prose-pre:text-xs md:prose-pre:text-sm">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1
                          className="text-lg md:text-xl font-bold mb-3 md:mb-4 mt-4 md:mt-6 border-b border-[#30363d] pb-2 text-white"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          className="text-base md:text-lg font-bold mb-2 md:mb-3 mt-4 md:mt-5 text-white"
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          className="text-sm md:text-base font-semibold mb-2 mt-3 md:mt-4 text-blue-200"
                          {...props}
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          className="text-[#58a6ff] hover:underline break-all"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc pl-4 mb-4 space-y-1"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-decimal pl-4 mb-4 space-y-1"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="mb-1" {...props} />
                      ),
                      code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline =
                          !match && !String(children).includes("\n");
                        return isInline ? (
                          <code
                            className="bg-[#6e7681]/20 text-[#c9d1d9] px-1.5 py-0.5 rounded-md text-[85%] font-mono"
                            {...props}
                          >
                            {children}
                          </code>
                        ) : (
                          <div className="relative group mt-4 mb-4">
                            <code
                              className="block bg-[#0d1117] p-3 md:p-4 rounded-lg border border-[#30363d] overflow-x-auto text-xs md:text-sm font-mono leading-normal"
                              {...props}
                            >
                              {children}
                            </code>
                          </div>
                        );
                      },
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-4">
                          <table
                            className="min-w-full border border-[#30363d] rounded-lg"
                            {...props}
                          />
                        </div>
                      ),
                      th: ({ node, ...props }) => (
                        <th
                          className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] text-left font-semibold text-white whitespace-nowrap"
                          {...props}
                        />
                      ),
                      td: ({ node, ...props }) => (
                        <td
                          className="px-4 py-2 border-b border-[#30363d]/50"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* User Avatar */}
              {msg.role === "user" && (
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#238636]/20 border border-[#238636]/30 flex items-center justify-center shrink-0 mt-1">
                  <User size={14} className="text-[#3fb950] md:w-4 md:h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex w-full gap-3 md:gap-4 animate-pulse">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#161b22] border border-[#30363d] shrink-0" />
              <div className="space-y-2 w-full max-w-md">
                <div className="h-4 w-24 bg-[#161b22] rounded rounded-tl-none" />
                <div className="h-4 w-full bg-[#161b22] rounded" />
                <div className="h-4 w-2/3 bg-[#161b22] rounded" />
              </div>
            </div>
          )}
        </ScrollableMessageContainer>

        {/* Input Area */}
        <div className="p-3 md:p-4 bg-[#0d1117] border-t border-[#30363d]">
          <div className="max-w-4xl mx-auto relative rounded-xl border border-[#30363d] bg-[#161b22] shadow-lg focus-within:ring-2 focus-within:ring-[#1f6feb] focus-within:border-transparent transition-all">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, false)}
              placeholder={
                isLoading ? "AI is thinking..." : "Ask a question..."
              }
              rows={1}
              disabled={isLoading}
              className="w-full bg-transparent text-[#c9d1d9] placeholder:text-[#8b949e] px-3 md:px-4 py-3 md:py-4 pr-12 md:pr-24 rounded-xl resize-none focus:outline-none max-h-[150px] md:max-h-[200px] overflow-y-auto scrollbar-hide text-sm md:text-base"
              style={{ minHeight: "48px" }}
            />
            <div className="absolute right-2 bottom-1.5 md:bottom-2 flex items-center gap-1">
              <button
                className="hidden md:block p-2 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#30363d] rounded-lg transition-colors"
                title="Attach file"
              >
                {" "}
              </button>
              <button
                onClick={handleChatClick}
                disabled={!inputValue.trim() || isLoading}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  inputValue.trim() && !isLoading
                    ? "bg-[#238636] text-white hover:bg-[#2ea043] shadow-md cursor-pointer"
                    : "bg-[#21262d] text-[#8b949e] cursor-not-allowed",
                )}
              >
                <Send size={16} className="md:w-[25px] md:h-[25px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
MessageThreadFull.displayName = "MessageThreadFull";
