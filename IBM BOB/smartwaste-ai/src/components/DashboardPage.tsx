"use client";

import { DEMO_WARD_STATS, DEMO_GRIEVANCES } from "@/lib/demo-data";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

const WARD_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

export default function DashboardPage() {
  const totalWaste = DEMO_WARD_STATS.reduce((s, w) => s + w.wasteCollected, 0);
  const avgCompliance = Math.round(DEMO_WARD_STATS.reduce((s, w) => s + w.segregationCompliance, 0) / DEMO_WARD_STATS.length);
  const totalActive = DEMO_WARD_STATS.reduce((s, w) => s + w.activeComplaints, 0);
  const totalResolved = DEMO_WARD_STATS.reduce((s, w) => s + w.resolvedComplaints, 0);
  const totalMissed = DEMO_WARD_STATS.reduce((s, w) => s + w.missedPickups, 0);
  const avgRecycling = Math.round(DEMO_WARD_STATS.reduce((s, w) => s + w.recyclingRate, 0) / DEMO_WARD_STATS.length);

  const recentGrievances = DEMO_GRIEVANCES.slice(0, 4);

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div className="px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card-bg)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Municipal Dashboard</h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Real-time overview — SmartWaste AI Command Center</p>
          </div>
          <span className="px-2 py-1 rounded-md text-xs font-semibold" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>DEMO DATA</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 p-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          {/* Hero KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { title: "Total Waste", value: (totalWaste / 1000).toFixed(1), unit: "T", icon: "🗑️", color: "#10b981", delta: "+3%" },
              { title: "Compliance", value: `${avgCompliance}%`, icon: "♻️", color: "#3b82f6", delta: "-2%" },
              { title: "Active Cases", value: totalActive, icon: "⚠️", color: "#f97316", delta: "-12%" },
              { title: "Resolved", value: totalResolved, icon: "✅", color: "#22c55e", delta: "+8%" },
              { title: "Missed", value: totalMissed, icon: "🚫", color: "#ef4444", delta: "-6%" },
              { title: "Recycling", value: `${avgRecycling}%`, icon: "🌿", color: "#8b5cf6", delta: "+5%" },
            ].map((kpi) => (
              <div
                key={kpi.title}
                className="rounded-2xl p-4"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{kpi.title}</span>
                  <span style={{ fontSize: 18 }}>{kpi.icon}</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: kpi.color, letterSpacing: "-0.02em" }}>
                  {kpi.value}
                  {kpi.unit && <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)", marginLeft: 2 }}>{kpi.unit}</span>}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.delta.startsWith("+") ? <TrendingUp size={10} color="#22c55e" /> : <TrendingDown size={10} color="#ef4444" />}
                  <span style={{ fontSize: 10, color: kpi.delta.startsWith("+") ? "#22c55e" : "#ef4444" }}>{kpi.delta}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Ward cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_WARD_STATS.map((w, idx) => (
              <div
                key={w.ward}
                className="rounded-2xl p-5"
                style={{ background: "var(--card-bg)", border: `2px solid ${WARD_COLORS[idx]}30`, boxShadow: "var(--shadow)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span style={{ fontWeight: 700, fontSize: 16, color: WARD_COLORS[idx] }}>{w.ward}</span>
                  <div className="rounded-full flex items-center justify-center" style={{ width: 36, height: 36, background: WARD_COLORS[idx] + "15", fontSize: 16 }}>🏘️</div>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Waste Collected", value: `${w.wasteCollected.toLocaleString()} kg` },
                    { label: "Recycling Rate", value: `${w.recyclingRate}%` },
                    { label: "Active Cases", value: w.activeComplaints },
                    { label: "Missed Pickups", value: w.missedPickups },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>{item.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{item.value}</span>
                    </div>
                  ))}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>Segregation</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: WARD_COLORS[idx] }}>{w.segregationCompliance}%</span>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 5, background: "var(--sidebar-bg)" }}>
                      <div className="rounded-full" style={{ height: "100%", width: `${w.segregationCompliance}%`, background: WARD_COLORS[idx], transition: "width 1s ease" }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent grievances */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)", background: "var(--sidebar-bg)" }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Recent Grievances</span>
              <span className="text-xs px-2 py-1 rounded-lg font-medium cursor-pointer transition-colors" style={{ color: "#10b981", background: "rgba(16,185,129,0.08)" }}>
                View All <ArrowRight size={10} style={{ display: "inline" }} />
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {recentGrievances.map((g) => {
                const priorityColor = { Low: "#22c55e", Medium: "#f59e0b", High: "#f97316", Critical: "#ef4444" }[g.priority];
                const statusColor = { New: "#3b82f6", Assigned: "#f59e0b", "In Progress": "#f97316", Resolved: "#22c55e" }[g.status];
                return (
                  <div key={g.id} className="px-5 py-3 flex items-center gap-4" style={{ borderBottomColor: "var(--border)" }}>
                    <div className="rounded-full flex-shrink-0" style={{ width: 6, height: 6, background: priorityColor }} />
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{g.category}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{g.citizen} • {g.ward} • {g.date}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0" style={{ color: statusColor, background: statusColor + "18" }}>
                      {g.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: "Optimize Routes", desc: "Run AI route planning", icon: "🚛", color: "#3b82f6" },
              { title: "Check Compliance", desc: "View segregation data", icon: "♻️", color: "#10b981" },
              { title: "New Complaint", desc: "Register citizen grievance", icon: "🗣️", color: "#f97316" },
              { title: "Generate Report", desc: "Export ward analytics", icon: "📊", color: "#8b5cf6" },
            ].map((action) => (
              <button
                key={action.title}
                className="flex flex-col gap-2 rounded-xl p-4 text-left transition-all duration-150"
                style={{
                  background: "var(--card-bg)",
                  border: `1.5px solid ${action.color}25`,
                  boxShadow: "var(--shadow)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = action.color;
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${action.color}20`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = action.color + "25";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow)";
                }}
              >
                <div className="flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: action.color + "15", fontSize: 20 }}>
                  {action.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: action.color }}>{action.title}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{action.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
