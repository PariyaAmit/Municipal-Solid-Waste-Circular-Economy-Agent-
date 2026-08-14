"use client";

import { DEMO_WARD_STATS, DEMO_DAILY_COLLECTION, DEMO_GRIEVANCES } from "@/lib/demo-data";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const WARD_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

function KPICard({ title, value, unit, change, icon, color }: {
  title: string; value: string | number; unit?: string;
  change?: number; icon: string; color: string;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</span>
        <div className="flex items-center justify-center rounded-xl" style={{ width: 36, height: 36, background: color + "18", fontSize: 16 }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color }}>
        {value}
        {unit && <span style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)", marginLeft: 3 }}>{unit}</span>}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          {change > 0 ? <TrendingUp size={12} color="#10b981" /> : change < 0 ? <TrendingDown size={12} color="#ef4444" /> : <Minus size={12} color="#6b7280" />}
          <span style={{ fontSize: 11, color: change > 0 ? "#10b981" : change < 0 ? "#ef4444" : "#6b7280" }}>
            {Math.abs(change)}% vs last week
          </span>
        </div>
      )}
    </div>
  );
}

function MiniBarChart({ data, colors, keys, height = 120 }: { data: Record<string, number | string>[]; colors: string[]; keys: string[]; height?: number }) {
  const maxVal = Math.max(...data.flatMap((d) => keys.map((k) => Number(d[k]) || 0)));
  return (
    <div className="overflow-x-auto">
      <div className="flex items-end gap-1" style={{ height, minWidth: data.length * 36 }}>
        {data.map((row, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="flex items-end gap-0.5 flex-1 w-full">
              {keys.map((k, ki) => (
                <div
                  key={k}
                  className="rounded-t-sm flex-1 transition-all duration-500"
                  style={{
                    height: `${(Number(row[k]) / maxVal) * (height - 28)}px`,
                    background: colors[ki],
                    opacity: 0.82,
                    minHeight: 2,
                  }}
                  title={`${k}: ${row[k]}`}
                />
              ))}
            </div>
            <div style={{ fontSize: 8, color: "var(--muted)", whiteSpace: "nowrap" }}>{row.day || row.week}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ segments, size = 100 }: { segments: { value: number; color: string; label: string }[]; size?: number }) {
  const cx = size / 2, cy = size / 2, r = (size / 2) * 0.72;
  let cumulative = 0;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const paths = segments.map((seg) => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += seg.value;
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = seg.value / total > 0.5 ? 1 : 0;
    return { ...seg, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z` };
  });
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
      {paths.map((p) => <path key={p.label} d={p.d} fill={p.color} opacity={0.85} />)}
      <circle cx={cx} cy={cy} r={r * 0.52} fill="var(--card-bg)" />
    </svg>
  );
}

export default function AnalyticsPage() {
  const totalWaste = DEMO_WARD_STATS.reduce((s, w) => s + w.wasteCollected, 0);
  const avgCompliance = Math.round(DEMO_WARD_STATS.reduce((s, w) => s + w.segregationCompliance, 0) / DEMO_WARD_STATS.length);
  const activeComplaints = DEMO_WARD_STATS.reduce((s, w) => s + w.activeComplaints, 0);
  const resolvedComplaints = DEMO_WARD_STATS.reduce((s, w) => s + w.resolvedComplaints, 0);
  const missedPickups = DEMO_WARD_STATS.reduce((s, w) => s + w.missedPickups, 0);
  const avgRecycling = Math.round(DEMO_WARD_STATS.reduce((s, w) => s + w.recyclingRate, 0) / DEMO_WARD_STATS.length);

  const complaintCategories = [
    { category: "Missed Collection", count: 18, color: "#ef4444" },
    { category: "Garbage Overflow", count: 12, color: "#f97316" },
    { category: "Illegal Dumping", count: 8, color: "#8b5cf6" },
    { category: "Street Cleaning", count: 14, color: "#f59e0b" },
    { category: "Segregation Issue", count: 6, color: "#10b981" },
    { category: "Other", count: 10, color: "#94a3b8" },
  ];
  const totalComplaints = complaintCategories.reduce((s, c) => s + c.count, 0);

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div className="px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card-bg)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Ward Analytics</h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>AI-powered municipal waste management insights</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-md text-xs font-semibold" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>DEMO DATA</span>
            <select
              className="rounded-lg px-3 py-1.5 text-sm outline-none"
              style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              <option>All Wards</option>
              <option>Ward 12</option>
              <option>Ward 15</option>
              <option>Ward 21</option>
              <option>Ward 28</option>
            </select>
            <select
              className="rounded-lg px-3 py-1.5 text-sm outline-none"
              style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 p-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <KPICard title="Total Waste" value={(totalWaste / 1000).toFixed(1)} unit="tonnes" icon="🗑️" color="#10b981" change={3.2} />
            <KPICard title="Segregation" value={avgCompliance} unit="%" icon="♻️" color="#3b82f6" change={-1.5} />
            <KPICard title="Active" value={activeComplaints} unit="cases" icon="⚠️" color="#f97316" change={-4.8} />
            <KPICard title="Resolved" value={resolvedComplaints} unit="cases" icon="✅" color="#22c55e" change={12.1} />
            <KPICard title="Missed" value={missedPickups} unit="pickups" icon="🚫" color="#ef4444" change={-6.7} />
            <KPICard title="Recycling" value={avgRecycling} unit="%" icon="🌿" color="#8b5cf6" change={2.4} />
          </div>

          {/* Charts row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Daily collection */}
            <div className="rounded-2xl p-5" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
              <div className="flex items-center justify-between mb-4">
                <div style={{ fontWeight: 600, fontSize: 15 }}>Daily Waste Collection (kg)</div>
                <div className="flex gap-3">
                  {DEMO_WARD_STATS.map((w, idx) => (
                    <div key={w.ward} className="flex items-center gap-1">
                      <span className="rounded-sm inline-block" style={{ width: 10, height: 10, background: WARD_COLORS[idx] }} />
                      <span style={{ fontSize: 10, color: "var(--muted)" }}>{w.ward}</span>
                    </div>
                  ))}
                </div>
              </div>
              <MiniBarChart
                data={DEMO_DAILY_COLLECTION}
                colors={WARD_COLORS}
                keys={["ward12", "ward15", "ward21", "ward28"]}
                height={150}
              />
            </div>

            {/* Complaint categories */}
            <div className="rounded-2xl p-5" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Complaint Categories</div>
              <div className="flex gap-4 items-center">
                <DonutChart
                  size={110}
                  segments={complaintCategories.map((c) => ({ value: c.count, color: c.color, label: c.category }))}
                />
                <div className="flex flex-col gap-1.5 flex-1">
                  {complaintCategories.map((c) => (
                    <div key={c.category} className="flex items-center gap-2">
                      <span className="rounded-sm flex-shrink-0" style={{ width: 10, height: 10, background: c.color, display: "inline-block" }} />
                      <span className="flex-1" style={{ fontSize: 11, color: "var(--foreground)" }}>{c.category}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: c.color }}>{c.count}</span>
                      <div className="rounded-full overflow-hidden" style={{ width: 40, height: 4, background: "var(--sidebar-bg)" }}>
                        <div style={{ height: "100%", width: `${(c.count / totalComplaints) * 100}%`, background: c.color, borderRadius: "9999px" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ward comparison table */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
            <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)", background: "var(--sidebar-bg)" }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Ward Performance Overview</span>
            </div>
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Ward", "Waste Collected", "Segregation %", "Recycling %", "Active Cases", "Resolved", "Missed Pickups", "Score"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "var(--muted)", borderBottom: "1px solid var(--border)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEMO_WARD_STATS.map((w, idx) => {
                    const score = Math.round((w.segregationCompliance * 0.4) + (w.recyclingRate * 0.3) + ((1 - w.missedPickups / 10) * 30));
                    return (
                      <tr key={w.ward} style={{ borderBottom: "1px solid var(--border)", background: idx % 2 === 0 ? "transparent" : "var(--sidebar-bg)" }}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full" style={{ width: 10, height: 10, background: WARD_COLORS[idx] }} />
                            <span style={{ fontWeight: 700, fontSize: 13 }}>{w.ward}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm">{w.wasteCollected.toLocaleString()} kg</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full overflow-hidden" style={{ width: 48, height: 5, background: "var(--border)" }}>
                              <div style={{ height: "100%", width: `${w.segregationCompliance}%`, background: w.segregationCompliance >= 75 ? "#10b981" : w.segregationCompliance >= 60 ? "#f59e0b" : "#ef4444", borderRadius: "9999px" }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600 }}>{w.segregationCompliance}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm font-semibold" style={{ color: "#8b5cf6" }}>{w.recyclingRate}%</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(249,115,22,0.1)", color: "#f97316" }}>{w.activeComplaints}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>{w.resolvedComplaints}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: w.missedPickups > 3 ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", color: w.missedPickups > 3 ? "#ef4444" : "#22c55e" }}>{w.missedPickups}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full overflow-hidden" style={{ width: 48, height: 5, background: "var(--border)" }}>
                              <div style={{ height: "100%", width: `${Math.min(score, 100)}%`, background: WARD_COLORS[idx], borderRadius: "9999px" }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: WARD_COLORS[idx] }}>{score}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insights */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <div className="flex items-center gap-2 mb-4">
              <span style={{ fontSize: 16 }}>🤖</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#10b981" }}>AI Insights & Anomalies</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: "📈", title: "Collection Efficiency", body: "Ward 21 is outperforming all other wards with 95%+ collection efficiency. Friday shows consistently highest collection volumes across all wards.", color: "#10b981" },
                { icon: "⚠️", title: "Anomaly Detected", body: "Ward 15 missed pickup rate increased by 40% vs last week. Possible cause: Vehicle breakdown on Route 3. Recommend immediate fleet inspection.", color: "#f97316" },
                { icon: "💡", title: "Optimization Opportunity", body: "Consolidating Ward 12 and Ward 28 morning routes could reduce fuel consumption by ~18% and improve collection times by 25 minutes.", color: "#3b82f6" },
              ].map((insight) => (
                <div key={insight.title} className="rounded-xl p-4" style={{ background: "var(--card-bg)", border: `1px solid ${insight.color}25` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: 16 }}>{insight.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: 12, color: insight.color }}>{insight.title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.6 }}>{insight.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
