"use client";

import { AppSettings } from "@/lib/types";
import { saveSettings } from "@/lib/storage";
import { Sun, Moon, Monitor, Globe, Bot, MessageSquare, Bell, Info } from "lucide-react";

interface SettingsPageProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

const MODELS = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile", desc: "Recommended — high quality, fast" },
  { id: "llama-3.1-70b-versatile", name: "Llama 3.1 70B", desc: "Balanced performance" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", desc: "Fast, lightweight" },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", desc: "Strong multilingual support" },
  { id: "gemma2-9b-it", name: "Gemma 2 9B", desc: "Efficient, good quality" },
];

function SettingRow({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex-1">
        <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
        {description && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, lineHeight: 1.5 }}>{description}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative rounded-full transition-all duration-200 flex-shrink-0"
      style={{
        width: 44,
        height: 24,
        background: value ? "#10b981" : "var(--border)",
        cursor: "pointer",
      }}
    >
      <span
        className="absolute rounded-full bg-white transition-transform duration-200"
        style={{
          width: 18,
          height: 18,
          top: 3,
          left: value ? 23 : 3,
        }}
      />
    </button>
  );
}

export default function SettingsPage({ settings, onSettingsChange }: SettingsPageProps) {
  const update = (patch: Partial<AppSettings>) => {
    const next = { ...settings, ...patch };
    onSettingsChange(next);
    saveSettings(next);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div className="px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card-bg)" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Settings</h1>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Configure SmartWaste AI platform preferences</p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 p-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {/* Appearance */}
          <div className="rounded-2xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Sun size={16} color="#10b981" />
              <span style={{ fontWeight: 700, fontSize: 15 }}>Appearance</span>
            </div>

            <SettingRow title="Theme" description="Choose the color scheme for the interface.">
              <div className="flex gap-2">
                {(["light", "dark", "system"] as const).map((t) => {
                  const Icon = t === "light" ? Sun : t === "dark" ? Moon : Monitor;
                  return (
                    <button
                      key={t}
                      onClick={() => update({ theme: t })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm capitalize transition-all"
                      style={{
                        background: settings.theme === t ? "rgba(16,185,129,0.1)" : "var(--sidebar-bg)",
                        border: settings.theme === t ? "1.5px solid #10b981" : "1px solid var(--border)",
                        color: settings.theme === t ? "#10b981" : "var(--foreground)",
                        fontWeight: settings.theme === t ? 600 : 400,
                      }}
                    >
                      <Icon size={13} />
                      {t}
                    </button>
                  );
                })}
              </div>
            </SettingRow>
          </div>

          {/* Language */}
          <div className="rounded-2xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Globe size={16} color="#3b82f6" />
              <span style={{ fontWeight: 700, fontSize: 15 }}>Language & Region</span>
            </div>

            <SettingRow title="Interface Language" description="Choose your preferred interface language.">
              <div className="flex gap-2">
                {([
                  { id: "en", label: "English" },
                  { id: "hi", label: "Hindi" },
                  { id: "gu", label: "Gujarati" },
                ] as const).map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => update({ language: lang.id })}
                    className="px-3 py-1.5 rounded-lg text-sm transition-all"
                    style={{
                      background: settings.language === lang.id ? "rgba(59,130,246,0.1)" : "var(--sidebar-bg)",
                      border: settings.language === lang.id ? "1.5px solid #3b82f6" : "1px solid var(--border)",
                      color: settings.language === lang.id ? "#3b82f6" : "var(--foreground)",
                      fontWeight: settings.language === lang.id ? 600 : 400,
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </SettingRow>
          </div>

          {/* AI */}
          <div className="rounded-2xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Bot size={16} color="#8b5cf6" />
              <span style={{ fontWeight: 700, fontSize: 15 }}>AI Configuration</span>
            </div>

            <SettingRow title="AI Model" description="Select the Groq model to use for AI responses.">
              <select
                value={settings.aiModel}
                onChange={(e) => update({ aiModel: e.target.value })}
                className="rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", color: "var(--foreground)", minWidth: 200 }}
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </SettingRow>

            <SettingRow title="Response Style" description="How the AI should structure its responses.">
              <div className="flex gap-2">
                {(["concise", "balanced", "detailed"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => update({ responseStyle: style })}
                    className="px-3 py-1.5 rounded-lg text-sm capitalize transition-all"
                    style={{
                      background: settings.responseStyle === style ? "rgba(139,92,246,0.1)" : "var(--sidebar-bg)",
                      border: settings.responseStyle === style ? "1.5px solid #8b5cf6" : "1px solid var(--border)",
                      color: settings.responseStyle === style ? "#8b5cf6" : "var(--foreground)",
                      fontWeight: settings.responseStyle === style ? 600 : 400,
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </SettingRow>

            <SettingRow title="Demo Mode" description="Use simulated municipal data for demonstrations. Disable to use real API integrations when available.">
              <Toggle value={settings.demoMode} onChange={(v) => update({ demoMode: v })} />
            </SettingRow>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Bell size={16} color="#f59e0b" />
              <span style={{ fontWeight: 700, fontSize: 15 }}>Notifications</span>
            </div>
            <SettingRow title="Enable Notifications" description="Receive alerts for new complaints, missed pickups, and AI recommendations.">
              <Toggle value={settings.notifications} onChange={(v) => update({ notifications: v })} />
            </SettingRow>
          </div>

          {/* About */}
          <div
            className="rounded-2xl p-5 flex items-start gap-4"
            style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.2)" }}
          >
            <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 40, height: 40, background: "rgba(16,185,129,0.12)", fontSize: 18 }}>
              🌿
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>SmartWaste AI</div>
              <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                Version 1.0.0 · Municipal Waste Management Platform<br />
                Powered by Groq LLM API · Built for IBM Hackathon 2024<br />
                Municipal Solid Waste & Circular Economy Challenge
              </div>
              <div className="flex items-center gap-1 mt-2" style={{ fontSize: 11, color: "var(--muted)" }}>
                <Info size={11} />
                API key is stored securely on the server. Never exposed to the browser.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
