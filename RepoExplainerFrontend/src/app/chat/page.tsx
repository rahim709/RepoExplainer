"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { ChatSidebar } from "@/app/components/ChatSidebar"; 
import { useState, useEffect, Suspense } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen, Loader2, X } from "lucide-react"; 
import { useSearchParams, useRouter } from "next/navigation";
import { useRepoChat } from "@/hooks/useRepoChat"; 
import api from "@/lib/axios"; 
import { Toaster } from "sonner"; 
import { cn } from "@/lib/utils";

function ChatContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // Mobile Sidebar State
  const searchParams = useSearchParams();
  const router = useRouter();

  const { 
    messages, 
    isLoading, 
    history, 
    currentProjectId,
    analyzeRepo, 
    sendChatMessage, 
    selectChat,
    handleNewChat
  } = useRepoChat();
  
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 1. Check Auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/api/user/check-auth");
        setIsAuthenticated(true);
      } catch (error) {
        router.replace("/auth/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  // 2. Handle Auto-Analysis (Pending URL or Query Param)
  useEffect(() => {
    if (isAuthenticated && !currentProjectId && !isLoading) {
      const pendingUrl = localStorage.getItem("pendingRepoUrl");
      if (pendingUrl) {
        analyzeRepo(pendingUrl);
        localStorage.removeItem("pendingRepoUrl");
        return;
      }
      const repoParam = searchParams.get("repo");
      if (repoParam) {
        analyzeRepo(decodeURIComponent(repoParam));
      }
    }
  }, [isAuthenticated, currentProjectId, isLoading, searchParams, analyzeRepo]); 

  // Mobile Handlers
  const handleMobileSelectChat = (id: string) => {
    selectChat(id);
    setIsMobileSidebarOpen(false);
  };

  const handleMobileNewChat = () => {
    handleNewChat();
    setIsMobileSidebarOpen(false);
  }

  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0d1117] text-white gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <p className="text-sm text-gray-400">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-[calc(100vh)] w-full bg-[#0d1117] overflow-hidden relative">
      <Toaster position="top-center" richColors theme="dark" />

      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      {/* 1. Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden",
          isMobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileSidebarOpen(false)}
      />
      
      {/* 2. Slide-out Drawer */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] bg-[#010409] z-50 transform transition-transform duration-300 ease-in-out md:hidden border-r border-[#30363d] flex flex-col",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
         {/* Close Button inside Drawer */}
         <div className="absolute top-3 right-3 z-50">
            <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 text-gray-400 hover:text-white bg-[#161b22] rounded-md border border-[#30363d]">
               <X size={18} />
            </button>
         </div>
         
         {/* Render Sidebar inside Drawer */}
         <ChatSidebar 
           className="w-full h-full pt-12" // Padding for close button
           history={history.map(h => ({
             id: h._id as any, 
             title: `${h.owner}/${h.repoName}`,
             date: h.updatedAt ? new Date(h.updatedAt).toLocaleDateString() : "Recent",
             messages: [] 
           }))} 
           activeChatId={currentProjectId as any}
           //onDeleteChat={() => {}} 
           onNewChat={handleMobileNewChat}
           onSelectChat={(id) => handleMobileSelectChat(id.toString())} 
         />
      </div>

      {/* --- DESKTOP SIDEBAR --- */}
      <div className={`${isSidebarOpen ? 'w-[260px]' : 'w-0 -translate-x-full opacity-0'} transition-all duration-300 ease-in-out border-r border-[#30363d] flex-shrink-0 hidden md:block relative`}>
         <ChatSidebar 
           className="w-[260px]" 
           history={history.map(h => ({
             id: h._id as any, 
             title: `${h.owner}/${h.repoName}`,
             date: h.updatedAt ? new Date(h.updatedAt).toLocaleDateString() : "Recent",
             messages: [] 
           }))} 
           activeChatId={currentProjectId as any}
           //onDeleteChat={() => {}} 
           onNewChat={handleNewChat}
           onSelectChat={(id) => selectChat(id.toString())} 
         />
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full bg-[#0d1117]">
        
        {/* Mobile Menu Trigger */}
        <div className="absolute top-4 left-4 z-20 md:hidden">
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 bg-[#161b22] border border-[#30363d] rounded-md text-[#c9d1d9] shadow-md active:scale-95 transition-transform"
          >
            <Menu size={20} />
          </button>
        </div>
        
        {/* Desktop Collapse Trigger */}
        <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex absolute top-4 left-4 z-20 p-2 text-[#8b949e] hover:text-white bg-transparent hover:bg-[#1f242c] rounded-md transition-all"
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
            {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>

        <MessageThreadFull 
          messages={messages}            
          isLoading={isLoading}          
          onChatStart={analyzeRepo}      
          onSendMessage={sendChatMessage} 
          className="h-full" 
        />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#0d1117] text-[#8b949e]">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}