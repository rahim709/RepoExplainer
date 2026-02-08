import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface ChatMessage {
  role: "user" | "assistant" | "model";
  content: string;
  uiComponent?: string;
  uiData?: any;
}

export interface ProjectData {
  _id: string;
  repoName: string;
  owner: string;
  updatedAt: string;
  chatHistory: ChatMessage[];
}

export function useRepoChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<ProjectData[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Helper to generate the consistent "Start Message"
  const getStartMessage = (url: string): ChatMessage => ({
    role: "user",
    content: `Analyzed repository: ${url}`,
  });

  // 1. FETCH ALL PROJECTS
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/api/user/allprojects");
        setHistory(data.projects || []);
      } catch (error) {
        console.error("Failed to load projects", error);
      }
    };
    fetchHistory();
  }, []);

  // 2. SELECT CHAT
  const selectChat = useCallback(
    (projectId: string) => {
      const project = history.find((p) => p._id === projectId);

      if (project) {
        setCurrentProjectId(projectId);

        const formattedMessages = project.chatHistory.map((msg: any) => ({
          ...msg,
          role: msg.role === "model" ? "assistant" : msg.role,
        }));

        // Logic: If the first message is AI, prepend the Fake User Message
        if (
          formattedMessages.length > 0 &&
          formattedMessages[0].role !== "user"
        ) {
          const repoUrl = `https://github.com/${project.owner}/${project.repoName}`;
          setMessages([getStartMessage(repoUrl), ...formattedMessages]);
        } else {
          setMessages(formattedMessages);
        }
      }
    },
    [history],
  );

  // 3. ANALYZE REPO
  const analyzeRepo = async (repoUrl: string) => {
    setIsLoading(true);
    const cleanUrl = repoUrl.trim();

    // Optimistic UI
    const startMsg = getStartMessage(cleanUrl);
    setMessages([startMsg]);

    try {
      const { data: project } = await api.post("/api/repo", { url: cleanUrl });

      setCurrentProjectId(project._id);

      setHistory((prev) => {
        const filtered = prev.filter((p) => p._id !== project._id);
        return [project, ...filtered];
      });

      const aiSummaryMsg = project.chatHistory.map((msg: any) => ({
        ...msg,
        role: msg.role === "model" ? "assistant" : msg.role,
      }));

      setMessages([startMsg, ...aiSummaryMsg]);
    } catch (error: any) {
      const errorMsg =
        error.response?.status === 402
          ? "Repo too large or GitHub API limit reached."
          : error.response?.data?.message || "Failed to analyze repository";

      toast.error(errorMsg);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. SEND MESSAGE
  const sendChatMessage = async (userMessage: string) => {
    if (!userMessage.trim() || !currentProjectId) return;

    const newUserMsg: ChatMessage = { role: "user", content: userMessage };

    // Optimistic Update
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const { data } = await api.post(
        `/api/user/chat?projectId=${currentProjectId}`,
        {
          message: userMessage,
        },
      );

      // ⚠️ FIX: Capture UI Component data if backend sends it
      const newAiMsg: ChatMessage = {
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, newAiMsg]);

      // Update Sidebar History
      setHistory((prev) =>
        prev.map((p) => {
          if (p._id === currentProjectId) {
            return {
              ...p,
              chatHistory: [...p.chatHistory, newUserMsg, newAiMsg],
            };
          }
          return p;
        }),
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");

      // ⚠️ FIX: Remove the optimistic message on failure
      setMessages((prev) => prev.filter((msg) => msg !== newUserMsg));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentProjectId(null);
    setMessages([]);
    router.replace("/chat");
  };

  return {
    messages,
    isLoading,
    history,
    currentProjectId,
    analyzeRepo,
    sendChatMessage,
    selectChat,
    handleNewChat,
  };
}
