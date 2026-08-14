"use client";

import { cn } from "@/lib/utils";
import { AgentType } from "@/lib/types";
import { AGENTS } from "@/lib/agents";
import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  LayoutDashboard,
  FileText,
  Route,
  Recycle,
  BarChart3,
  Settings,
  User,
  X,
  Pencil,
  ChevronRight,
  Leaf,
} from "lucide-react";
import { Conversation } from "@/lib/types";
import { useState } from "react";
import { formatDate } from "@/lib/utils";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  activePage: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onNavigate: (page: string) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const AGENT_COLORS: Record<AgentType, string> = {
  assistant: "text-emerald-600",
  route: "text-blue-600",
  segregation: "text-green-600",
  grievance: "text-orange-600",
  routing: "text-purple-600",
  analytics: "text-teal-600",
};

const NAV_ITEMS = [
  { id: "chat", label: "Smart Assistant", icon: MessageSquare, agent: "assistant" as AgentType },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, agent: null },
  { id: "grievances", label: "Grievances", icon: FileText, agent: null },
  { id: "routes", label: "Route Optimization", icon: Route, agent: null },
  { id: "segregation", label: "Segregation", icon: Recycle, agent: null },
  { id: "analytics", label: "Ward Analytics", icon: BarChart3, agent: null },
];

export default function Sidebar({
  conversations,
  activeConversationId,
  activePage,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onNavigate,
  onClose,
  isMobile,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEdit = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveEdit = (id: string) => {
    if (editTitle.trim()) onRenameConversation(id, editTitle.trim());
    setEditingId(null);
  };

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        width: "260px",
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            }}
          >
            <Leaf size={18} color="white" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>SmartWaste AI</div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>Municipal Platform</div>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* New Chat */}
      <div className="px-3 py-3">
        <button
          onClick={() => {
            onNewChat();
            if (isMobile) onClose?.();
          }}
          className="flex items-center gap-2 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            boxShadow: "0 2px 8px rgba(16,185,129,0.25)",
          }}
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2"
          style={{ background: "var(--input-bg)", border: "1px solid var(--border)" }}
        >
          <Search size={13} style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--foreground)" }}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 pb-2">
        <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, paddingLeft: 4 }}>
          Navigation
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (isMobile) onClose?.();
              }}
              className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm transition-all duration-150 mb-0.5"
              style={{
                background: isActive ? "rgba(16,185,129,0.1)" : "transparent",
                color: isActive ? "#10b981" : "var(--foreground)",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <Icon size={15} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Agent Switcher */}
      <div className="px-3 pb-2">
        <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, paddingLeft: 4 }}>
          AI Agents
        </div>
        {AGENTS.map((agent) => {
          const isActive = activePage === "chat" && activeConversationId && 
            conversations.find(c => c.id === activeConversationId)?.agentType === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => {
                onNavigate(`agent:${agent.id}`);
                if (isMobile) onClose?.();
              }}
              className="flex items-center gap-2 w-full rounded-lg px-3 py-1.5 text-xs transition-all duration-150 mb-0.5"
              style={{
                background: isActive ? "rgba(16,185,129,0.08)" : "transparent",
                color: isActive ? "#10b981" : "var(--foreground)",
              }}
            >
              <span>{agent.icon}</span>
              <span className="flex-1 text-left">{agent.name}</span>
              <ChevronRight size={11} style={{ color: "var(--muted)" }} />
            </button>
          );
        })}
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto px-3 pb-2 min-h-0">
        {filtered.length > 0 && (
          <>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, paddingLeft: 4 }}>
              Recent Chats
            </div>
            {filtered.slice(0, 20).map((conv) => (
              <div
                key={conv.id}
                className="group flex items-center gap-1.5 rounded-lg px-2 py-2 mb-0.5 cursor-pointer transition-all duration-150"
                style={{
                  background:
                    activeConversationId === conv.id && activePage === "chat"
                      ? "rgba(16,185,129,0.1)"
                      : "transparent",
                }}
                onClick={() => {
                  onSelectConversation(conv.id);
                  if (isMobile) onClose?.();
                }}
              >
                {editingId === conv.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => saveEdit(conv.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(conv.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="flex-1 text-xs px-1 py-0.5 rounded outline-none"
                    style={{ background: "var(--input-bg)", border: "1px solid var(--accent)", color: "var(--foreground)" }}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>
                      {AGENTS.find((a) => a.id === conv.agentType)?.icon || "💬"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="truncate"
                        style={{ fontSize: 12, fontWeight: activeConversationId === conv.id ? 600 : 400, color: "var(--foreground)" }}
                      >
                        {conv.title}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>{formatDate(conv.updatedAt)}</div>
                    </div>
                    <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); startEdit(conv); }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); }}
                        className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        )}
        {filtered.length === 0 && conversations.length === 0 && (
          <div className="text-center py-8" style={{ color: "var(--muted)", fontSize: 12 }}>
            No conversations yet.
            <br />Start a new chat above.
          </div>
        )}
      </div>

      {/* Bottom: Settings & Profile */}
      <div
        className="px-3 py-3 flex flex-col gap-1"
        style={{ borderTop: "1px solid var(--sidebar-border)" }}
      >
        <button
          onClick={() => { onNavigate("settings"); if (isMobile) onClose?.(); }}
          className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm transition-colors"
          style={{
            background: activePage === "settings" ? "rgba(16,185,129,0.1)" : "transparent",
            color: activePage === "settings" ? "#10b981" : "var(--foreground)",
          }}
        >
          <Settings size={15} />
          Settings
        </button>
        <div
          className="flex items-center gap-2.5 rounded-lg px-3 py-2"
          style={{ background: "var(--input-bg)", border: "1px solid var(--border)" }}
        >
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{ width: 28, height: 28, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white", fontSize: 12, fontWeight: 700 }}
          >
            MO
          </div>
          <div className="min-w-0 flex-1">
            <div style={{ fontSize: 12, fontWeight: 600 }}>Municipal Officer</div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>Admin Access</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
