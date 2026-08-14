"use client";

import { useState, useEffect, useCallback } from "react";
import { Conversation, AgentType, AppSettings } from "@/lib/types";
import {
  getConversations,
  saveConversations,
  createConversation,
  deleteConversation,
  getSettings,
} from "@/lib/storage";
import { generateId } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import DashboardPage from "@/components/DashboardPage";
import GrievancesPage from "@/components/GrievancesPage";
import RoutesPage from "@/components/RoutesPage";
import SegregationPage from "@/components/SegregationPage";
import AnalyticsPage from "@/components/AnalyticsPage";
import SettingsPage from "@/components/SettingsPage";
import { Menu, X } from "lucide-react";

export default function AppShell() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState("chat");
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Apply theme
  useEffect(() => {
    const applyTheme = () => {
      const theme = settings.theme;
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else if (theme === "light") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDark) document.documentElement.setAttribute("data-theme", "dark");
        else document.documentElement.removeAttribute("data-theme");
      }
    };
    applyTheme();
  }, [settings.theme]);

  // Load from localStorage on mount
  useEffect(() => {
    const convs = getConversations();
    setConversations(convs);
    if (convs.length > 0) {
      setActiveConversationId(convs[0].id);
    }
    setMounted(true);
  }, []);

  // Persist conversations
  useEffect(() => {
    if (mounted) saveConversations(conversations);
  }, [conversations, mounted]);

  const handleNewChat = useCallback((agentType: AgentType = "assistant") => {
    const conv = createConversation(agentType);
    setConversations((prev) => [conv, ...prev]);
    setActiveConversationId(conv.id);
    setActivePage("chat");
  }, []);

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setActivePage("chat");
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const next = deleteConversation(prev, id);
      // If deleting active, select next
      if (id === activeConversationId) {
        const remaining = next;
        if (remaining.length > 0) setActiveConversationId(remaining[0].id);
        else setActiveConversationId(null);
      }
      return next;
    });
  };

  const handleRenameConversation = (id: string, title: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  };

  const handleUpdateConversation = useCallback((conv: Conversation) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === conv.id);
      if (idx === -1) return [conv, ...prev];
      const next = [...prev];
      next[idx] = conv;
      return next;
    });
  }, []);

  const handleCreateConversation = useCallback(
    (agentType: AgentType, firstMessage?: string) => {
      const conv = createConversation(agentType);
      setConversations((prev) => [conv, ...prev]);
      setActiveConversationId(conv.id);
      setActivePage("chat");
    },
    []
  );

  const handleNavigate = (page: string) => {
    if (page.startsWith("agent:")) {
      const agentType = page.replace("agent:", "") as AgentType;
      handleNewChat(agentType);
    } else {
      setActivePage(page);
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 56, height: 56, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
            <span style={{ fontSize: 24 }}>🌿</span>
          </div>
          <div style={{ fontSize: 14, color: "var(--muted)" }}>Loading SmartWaste AI...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — always visible on desktop, drawer on mobile */}
      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-50 md:z-auto
          transform transition-transform duration-250 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{ height: "100vh" }}
      >
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          activePage={activePage}
          onNewChat={() => handleNewChat("assistant")}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
          onNavigate={handleNavigate}
          onClose={() => setSidebarOpen(false)}
          isMobile={sidebarOpen}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div
          className="flex md:hidden items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--card-bg)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--foreground)" }}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-lg" style={{ width: 28, height: 28, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
              <span style={{ fontSize: 14 }}>🌿</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>SmartWaste AI</span>
          </div>
          <div style={{ width: 36 }} />
        </div>

        {/* Page content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {activePage === "chat" && (
            <ChatWindow
              conversation={activeConversation}
              onUpdateConversation={handleUpdateConversation}
              onCreateConversation={handleCreateConversation}
            />
          )}
          {activePage === "dashboard" && <DashboardPage />}
          {activePage === "grievances" && <GrievancesPage />}
          {activePage === "routes" && <RoutesPage />}
          {activePage === "segregation" && <SegregationPage />}
          {activePage === "analytics" && <AnalyticsPage />}
          {activePage === "settings" && (
            <SettingsPage settings={settings} onSettingsChange={setSettings} />
          )}
        </div>
      </main>
    </div>
  );
}
