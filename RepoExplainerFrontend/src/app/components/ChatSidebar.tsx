"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, MessageSquare, Trash2, LogOut, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";

interface SidebarItem {
  id: string;
  title: string;
  date: string;
}

interface ChatSidebarProps {
  className?: string;
  history: SidebarItem[];
  activeChatId: string | null;
  isLoading?: boolean;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

export function ChatSidebar({
  className,
  history,
  activeChatId,
  isLoading = false,
  onNewChat,
  onSelectChat,
}: ChatSidebarProps) {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState({ name: "User", initials: "U" });

  // 1. Local state to hide deleted items instantly
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("fullName") || "Abdur Rahim";
    const initials = storedName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    setUserData({ name: storedName, initials });

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/user/logout");
      // Changed to .error for RED toast color
      toast.error("Logged out successfully");
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error: any) {
      // Changed to .error for RED toast color
      toast.error("Logged out successfully");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      localStorage.clear();
      router.replace("/");
      router.refresh();
    }
  };

  // 2. Self-contained Delete Function
  const handleDelete = async (projectId: string) => {
    // Optimistic Update: Hide it immediately
    setDeletedIds((prev) => [...prev, projectId]);

    try {
      await api.delete(`/api/user/chat?projectId=${projectId}`);
      toast.success("Chat deleted");

      router.refresh();

      if (activeChatId === projectId) {
        onNewChat();
      }
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete chat");
      // Revert if failed
      setDeletedIds((prev) => prev.filter((id) => id !== projectId));
    }
  };

  const visibleHistory = history.filter(
    (chat) => !deletedIds.includes(chat.id),
  );

  return (
    <div
      className={cn(
        "w-[260px] flex flex-col h-full border-r border-[#30363d] bg-[#010409]",
        className,
      )}
    >
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-white bg-[#238636] hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] rounded-md transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus size={16} /> <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-transparent">
        <h4 className="px-3 text-xs font-semibold text-[#8b949e] mb-2 uppercase tracking-wider">
          Recent
        </h4>

        {isLoading ? (
          <div className="space-y-2 mt-2 px-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-9 w-full bg-[#161b22] rounded-md animate-pulse border border-[#30363d]/50"
              />
            ))}
          </div>
        ) : visibleHistory.length === 0 ? (
          <p className="px-3 text-xs text-[#8b949e] italic mt-2">
            No recent chats
          </p>
        ) : (
          visibleHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "group flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors text-left cursor-pointer",
                String(activeChatId) === String(chat.id)
                  ? "bg-[#161b22] text-white font-medium border-l-2 border-[#238636]"
                  : "text-[#c9d1d9] hover:bg-[#161b22] hover:text-white",
              )}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare
                  size={14}
                  className={cn(
                    "shrink-0",
                    String(activeChatId) === String(chat.id)
                      ? "text-white"
                      : "text-[#8b949e]",
                  )}
                />
                <span className="truncate">{chat.title}</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex items-center">
                <div
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(chat.id);
                  }}
                  className="p-1 hover:bg-[#da3633]/20 hover:text-[#f85149] rounded transition-colors"
                >
                  <Trash2 size={14} />
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <div
        className="p-3 border-t border-[#30363d] mt-auto relative"
        ref={profileRef}
      >
        {showProfileMenu && (
          <div className="absolute bottom-full left-0 w-full px-3 pb-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-[#f85149] hover:bg-[#da3633]/10 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className={cn(
            "flex items-center gap-3 w-full px-2 py-2 text-sm text-[#c9d1d9] rounded-md transition-all cursor-pointer",
            showProfileMenu
              ? "bg-[#161b22] text-white"
              : "hover:bg-[#161b22] hover:text-white",
          )}
        >
          <div className="w-8 h-8 rounded-full bg-[#30363d] flex items-center justify-center border border-[#8b949e] shrink-0">
            <span className="font-bold text-xs text-white">
              {userData.initials}
            </span>
          </div>
          <div className="flex flex-col items-start overflow-hidden">
            <span className="font-medium text-white truncate w-full text-left">
              {userData.name}
            </span>
            <span className="text-xs text-[#8b949e]">Free Plan</span>
          </div>
          <ChevronUp
            size={14}
            className={cn(
              "ml-auto text-[#8b949e] transition-transform",
              showProfileMenu && "rotate-180",
            )}
          />
        </button>
      </div>
    </div>
  );
}