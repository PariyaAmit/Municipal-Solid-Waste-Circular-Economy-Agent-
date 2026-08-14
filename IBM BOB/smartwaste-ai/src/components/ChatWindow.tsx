"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Conversation, Message, AgentType } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { getAgent } from "@/lib/agents";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";
import { Bot, ChevronDown, Leaf, AlertCircle } from "lucide-react";
import { AGENTS } from "@/lib/agents";

interface ChatWindowProps {
  conversation: Conversation | null;
  onUpdateConversation: (conv: Conversation) => void;
  onCreateConversation: (agentType: AgentType, firstMessage?: string) => void;
}

export default function ChatWindow({
  conversation,
  onUpdateConversation,
  onCreateConversation,
}: ChatWindowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, [conversation?.id, scrollToBottom]);

  useEffect(() => {
    if (isLoading) scrollToBottom();
  }, [isLoading, scrollToBottom]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 200);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const sendMessage = useCallback(
    async (content: string, targetConversation?: Conversation) => {
      const conv = targetConversation || conversation;
      if (!conv) return;

      const agent = getAgent(conv.agentType);

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
        agentType: conv.agentType,
      };

      const loadingMessage: Message = {
        id: generateId() + "_loading",
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        agentType: conv.agentType,
      };

      const updatedMessages = [...conv.messages, userMessage];
      const updatedWithLoading = [...updatedMessages, loadingMessage];

      const updatedConv: Conversation = {
        ...conv,
        messages: updatedWithLoading,
        updatedAt: new Date().toISOString(),
        title:
          conv.messages.filter((m) => m.role === "user").length === 0
            ? content.substring(0, 42) + (content.length > 42 ? "..." : "")
            : conv.title,
      };

      onUpdateConversation(updatedConv);
      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      setAbortController(controller);

      try {
        const payload = {
          messages: updatedMessages
            .filter((m) => !m.id.endsWith("_loading"))
            .map((m) => ({ role: m.role, content: m.content })),
          systemPrompt: agent.systemPrompt,
        };

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Unexpected error from AI service.");
        }

        const aiMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: data.content,
          timestamp: new Date().toISOString(),
          agentType: conv.agentType,
        };

        const finalMessages = [...updatedMessages, aiMessage];
        onUpdateConversation({
          ...updatedConv,
          messages: finalMessages,
          updatedAt: new Date().toISOString(),
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // Stopped by user — keep messages as-is without loading bubble
          const finalMessages = updatedMessages;
          onUpdateConversation({
            ...updatedConv,
            messages: finalMessages,
            updatedAt: new Date().toISOString(),
          });
        } else {
          const errorMsg =
            err instanceof Error
              ? err.message
              : "SmartWaste AI is temporarily unavailable. Please try again.";
          setError(errorMsg);
          // Remove loading bubble
          onUpdateConversation({
            ...updatedConv,
            messages: updatedMessages,
            updatedAt: new Date().toISOString(),
          });
        }
      } finally {
        setIsLoading(false);
        setAbortController(null);
      }
    },
    [conversation, onUpdateConversation]
  );

  const handleSend = (content: string) => {
    if (!conversation) {
      onCreateConversation("assistant", content);
      return;
    }
    sendMessage(content);
  };

  const handleStop = () => {
    abortController?.abort();
  };

  const handleRegenerate = () => {
    if (!conversation) return;
    const userMessages = conversation.messages.filter((m) => m.role === "user");
    if (userMessages.length === 0) return;
    const lastUserMsg = userMessages[userMessages.length - 1];
    // Remove last AI message
    const messagesWithoutLastAI = [...conversation.messages];
    for (let i = messagesWithoutLastAI.length - 1; i >= 0; i--) {
      if (messagesWithoutLastAI[i].role === "assistant") {
        messagesWithoutLastAI.splice(i, 1);
        break;
      }
    }
    const convWithoutLast = { ...conversation, messages: messagesWithoutLastAI };
    sendMessage(lastUserMsg.content, convWithoutLast);
  };

  const handleLike = (messageId: string) => {
    if (!conversation) return;
    const updated = {
      ...conversation,
      messages: conversation.messages.map((m) =>
        m.id === messageId ? { ...m, liked: !m.liked, disliked: false } : m
      ),
    };
    onUpdateConversation(updated);
  };

  const handleDislike = (messageId: string) => {
    if (!conversation) return;
    const updated = {
      ...conversation,
      messages: conversation.messages.map((m) =>
        m.id === messageId ? { ...m, disliked: !m.disliked, liked: false } : m
      ),
    };
    onUpdateConversation(updated);
  };

  const visibleMessages = conversation?.messages.filter(
    (m) => !m.id.endsWith("_loading")
  ) ?? [];

  const loadingMessage: Message = {
    id: "loading",
    role: "assistant",
    content: "",
    timestamp: new Date().toISOString(),
  };

  const agent = conversation ? getAgent(conversation.agentType) : null;

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--card-bg)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 38,
              height: 38,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            }}
          >
            <Leaf size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>SmartWaste AI</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>
              {agent ? agent.name : "AI-powered Municipal Waste Management Assistant"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", fontSize: 12, fontWeight: 600 }}>
            <span className="rounded-full animate-pulse-dot" style={{ width: 6, height: 6, background: "#10b981", display: "inline-block" }} />
            AI Online
          </div>
          {/* Agent Switcher Dropdown */}
          <div className="relative group">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              {agent ? agent.icon : "🤖"} {agent ? agent.name : "Smart Assistant"}
              <ChevronDown size={12} />
            </button>
            <div
              className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-50 hidden group-hover:block group-focus-within:block"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)", width: 220 }}
            >
              {AGENTS.map((a) => (
                <button
                  key={a.id}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm transition-colors text-left"
                  style={{ color: "var(--foreground)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sidebar-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => onCreateConversation(a.id as AgentType)}
                >
                  <span>{a.icon}</span>
                  <div>
                    <div style={{ fontWeight: 500 }}>{a.name}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)" }}>{a.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ minHeight: 0 }}
      >
        {!conversation || visibleMessages.length === 0 ? (
          <WelcomeScreen
            onSuggest={handleSend}
            onAgentSelect={(agentType) => onCreateConversation(agentType)}
          />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
            {visibleMessages.map((msg, idx) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isLast={idx === visibleMessages.length - 1 && msg.role === "assistant"}
                onLike={handleLike}
                onDislike={handleDislike}
                onRegenerate={handleRegenerate}
              />
            ))}
            {isLoading && (
              <MessageBubble message={loadingMessage} isLoading />
            )}
            {error && (
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3 animate-fade-in"
                style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626", fontSize: 13 }}
              >
                <AlertCircle size={15} />
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Scroll to bottom */}
      {showScrollBtn && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-24 right-8 rounded-full p-2 shadow-md transition-all"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)", zIndex: 10 }}
        >
          <ChevronDown size={18} />
        </button>
      )}

      {/* Input */}
      <div className="flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}
