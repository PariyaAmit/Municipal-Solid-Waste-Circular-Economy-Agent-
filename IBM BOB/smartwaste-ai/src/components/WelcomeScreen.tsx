"use client";

import { AgentType } from "@/lib/types";
import { AGENTS } from "@/lib/agents";

interface WelcomeScreenProps {
  onSuggest: (text: string) => void;
  onAgentSelect: (agent: AgentType) => void;
}

const QUICK_CARDS = [
  {
    icon: "🚛",
    title: "Optimize Collection",
    description: "Find efficient waste collection routes for your ward.",
    agent: "route" as AgentType,
    suggestion: "Optimize waste collection routes for Ward 12",
  },
  {
    icon: "♻️",
    title: "Improve Segregation",
    description: "Analyze and improve household waste segregation compliance.",
    agent: "segregation" as AgentType,
    suggestion: "Analyze segregation compliance for all wards",
  },
  {
    icon: "🗣️",
    title: "Report a Problem",
    description: "Register a waste management complaint or grievance.",
    agent: "grievance" as AgentType,
    suggestion: "I want to report a missed garbage collection",
  },
  {
    icon: "📊",
    title: "Analyze Ward",
    description: "Get AI-powered insights and analytics for your ward.",
    agent: "analytics" as AgentType,
    suggestion: "Show analytics and insights for all wards",
  },
];

export default function WelcomeScreen({ onSuggest, onAgentSelect }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center animate-fade-in">
      {/* Logo mark */}
      <div
        className="flex items-center justify-center rounded-2xl mb-6"
        style={{
          width: 72,
          height: 72,
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          boxShadow: "0 8px 24px rgba(16,185,129,0.25)",
        }}
      >
        <span style={{ fontSize: 32 }}>🌿</span>
      </div>

      {/* Headline */}
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>
        SmartWaste AI
      </h1>
      <p
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: "#10b981",
          marginBottom: 12,
          fontStyle: "italic",
        }}
      >
        "Smarter Cities. Cleaner Wards. Better Waste Management."
      </p>
      <p
        style={{
          maxWidth: 540,
          color: "var(--muted)",
          fontSize: 14,
          lineHeight: 1.7,
          marginBottom: 36,
        }}
      >
        An AI-powered municipal waste management assistant for collection optimization, citizen
        grievances, segregation compliance, and ward-level intelligence.
      </p>

      {/* Quick action cards */}
      <div
        className="grid gap-3 w-full"
        style={{ maxWidth: 600, gridTemplateColumns: "repeat(2, 1fr)" }}
      >
        {QUICK_CARDS.map((card) => (
          <button
            key={card.agent}
            onClick={() => {
              onAgentSelect(card.agent);
              onSuggest(card.suggestion);
            }}
            className="flex flex-col items-start gap-1.5 rounded-xl p-4 text-left transition-all duration-200 group"
            style={{
              background: "var(--sidebar-bg)",
              border: "1.5px solid var(--border)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#10b981";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(16,185,129,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: 24 }}>{card.icon}</span>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{card.title}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
              {card.description}
            </div>
          </button>
        ))}
      </div>

      {/* Agent buttons */}
      <div className="flex flex-wrap gap-2 mt-6 justify-center" style={{ maxWidth: 600 }}>
        <div style={{ width: "100%", fontSize: 11, color: "var(--muted)", marginBottom: 4, fontWeight: 500 }}>
          Switch AI Agent:
        </div>
        {AGENTS.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onAgentSelect(agent.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-150"
            style={{
              background: "var(--sidebar-bg)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              fontWeight: 500,
            }}
          >
            <span>{agent.icon}</span>
            {agent.name}
          </button>
        ))}
      </div>
    </div>
  );
}
