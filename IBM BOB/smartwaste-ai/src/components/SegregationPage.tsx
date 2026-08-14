"use client";

import { DEMO_SEGREGATION, DEMO_WARD_STATS } from "@/lib/demo-data";

const WARD_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];
const WEEK_DATA = [
  { week: "Week 1", ward12: 70, ward15: 62, ward21: 82, ward28: 65 },
  { week: "Week 2", ward12: 68, ward15: 58, ward21: 84, ward28: 63 },
  { week: "Week 3", ward12: 72, ward15: 56, ward21: 83, ward28: 67 },
  { week: "Week 4", ward12: 72, ward15: 58, ward21: 84, ward28: 67 },
];

function BarChart({ data, maxValue = 100, height = 120 }: { data: { label: string; value: number; color: string }[]; maxValue?: number; height?: number }) {
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1 flex-1">
          <div style={{ fontSize: 10, fontWeight: 600, color: item.color }}>{item.value}%</div>
          <div
            className="rounded-t-md w-full transition-all duration-700"
            style={{ height: `${(item.value / maxValue) * (height - 30)}px`, background: item.color, minHeight: 4, opacity: 0.85 }}
          />
          <div style={{ fontSize: 9, color: "var(--muted)", textAlign: "center", lineHeight: 1.2 }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function WasteDonut({ wet, dry, recyclable, mixed }: { wet: number; dry: number; recyclable: number; mixed: number }) {
  const size = 100;
  const cx = size / 2;
  const cy = size / 2;
  const r = 36;
  const segments = [
    { value: wet, color: "#10b981", label: "Wet" },
    { value: dry, color: "#f59e0b", label: "Dry" },
    { value: recyclable, color: "#3b82f6", label: "Recyc." },
    { value: mixed, color: "#ef4444", label: "Mixed" },
  ];
  let cumulative = 0;
  const paths = segments.map((seg) => {
    const startAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
    cumulative += seg.value;
    const endAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = seg.value > 50 ? 1 : 0;
    return { ...seg, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z` };
  });
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: 90, height: 90 }}>
      {paths.map((p) => <path key={p.label} d={p.d} fill={p.color} opacity={0.85} />)}
      <circle cx={cx} cy={cy} r={18} fill="var(--card-bg)" />
    </svg>
  );
}

export default function SegregationPage() {
  const overall = Math.round(DEMO_WARD_STATS.reduce((s, w) => s + w.segregationCompliance, 0) / DEMO_WARD_STATS.length);

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div className="px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card-bg)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Segregation Compliance</h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Household waste segregation monitoring & AI recommendations</p>
          </div>
          <span className="px-2 py-1 rounded-md text-xs font-semibold" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>DEMO DATA</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 p-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          {/* Overall compliance */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 8 }}>Overall City-wide Segregation Compliance</div>
                <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1 }}>{overall}%</div>
                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>Average across all monitored wards</div>
              </div>
              <div className="flex flex-col gap-2" style={{ fontSize: 12, opacity: 0.9 }}>
                <div className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.5)", display: "inline-block" }} /> Wet: ~40%</div>
                <div className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.5)", display: "inline-block" }} /> Dry: ~30%</div>
                <div className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.5)", display: "inline-block" }} /> Recyclable: ~16%</div>
                <div className="flex items-center gap-2"><span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.5)", display: "inline-block" }} /> Mixed: ~14%</div>
              </div>
            </div>
            {/* Compliance bar */}
            <div className="mt-4">
              <div className="rounded-full overflow-hidden" style={{ height: 8, background: "rgba(255,255,255,0.2)" }}>
                <div className="rounded-full" style={{ height: "100%", width: `${overall}%`, background: "white", opacity: 0.9, transition: "width 1s ease" }} />
              </div>
            </div>
          </div>

          {/* Ward compliance cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_SEGREGATION.map((ward, idx) => (
              <div
                key={ward.ward}
                className="rounded-2xl p-4"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{ward.ward}</span>
                  <div className="flex items-center justify-center rounded-full" style={{ width: 28, height: 28, background: WARD_COLORS[idx] + "20" }}>
                    <span style={{ fontSize: 14 }}>♻️</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <WasteDonut {...ward} />
                  <div className="flex flex-col gap-1" style={{ fontSize: 10 }}>
                    {[
                      { label: "Wet", value: ward.wet, color: "#10b981" },
                      { label: "Dry", value: ward.dry, color: "#f59e0b" },
                      { label: "Recycl.", value: ward.recyclable, color: "#3b82f6" },
                      { label: "Mixed", value: ward.mixed, color: "#ef4444" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-1.5">
                        <span className="rounded-full inline-block" style={{ width: 7, height: 7, background: item.color, flexShrink: 0 }} />
                        <span style={{ color: "var(--muted)" }}>{item.label}:</span>
                        <span style={{ fontWeight: 600 }}>{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: 10, color: "var(--muted)" }}>Compliance</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: DEMO_WARD_STATS[idx].segregationCompliance >= 75 ? "#10b981" : DEMO_WARD_STATS[idx].segregationCompliance >= 60 ? "#f59e0b" : "#ef4444" }}>
                      {DEMO_WARD_STATS[idx].segregationCompliance}%
                    </span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 5, background: "var(--sidebar-bg)" }}>
                    <div
                      className="rounded-full"
                      style={{
                        height: "100%",
                        width: `${DEMO_WARD_STATS[idx].segregationCompliance}%`,
                        background: DEMO_WARD_STATS[idx].segregationCompliance >= 75 ? "#10b981" : DEMO_WARD_STATS[idx].segregationCompliance >= 60 ? "#f59e0b" : "#ef4444",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly trend */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
          >
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Weekly Compliance Trend</div>
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3" style={{ color: "var(--muted)", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>Week</th>
                    {DEMO_SEGREGATION.map((w) => (
                      <th key={w.ward} className="text-center py-2 px-3" style={{ color: "var(--muted)", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>{w.ward}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WEEK_DATA.map((row, ridx) => (
                    <tr key={row.week} style={{ background: ridx % 2 === 0 ? "transparent" : "var(--sidebar-bg)" }}>
                      <td className="py-2 px-3 font-semibold">{row.week}</td>
                      {[row.ward12, row.ward15, row.ward21, row.ward28].map((val, idx) => (
                        <td key={idx} className="py-2 px-3 text-center font-semibold" style={{ color: val >= 75 ? "#10b981" : val >= 60 ? "#f59e0b" : "#ef4444" }}>
                          {val}%
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ward comparison bar chart */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
          >
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Ward Compliance Comparison</div>
            <BarChart
              height={160}
              data={DEMO_WARD_STATS.map((w, idx) => ({
                label: w.ward,
                value: w.segregationCompliance,
                color: WARD_COLORS[idx],
              }))}
            />
          </div>

          {/* AI Recommendations */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.2)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span style={{ fontSize: 16 }}>🤖</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#10b981" }}>AI Recommendations</span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                {
                  ward: "Ward 15",
                  compliance: 58,
                  issue: "High mixed waste rate (24%)",
                  rec: "Send targeted Gujarati awareness messages to 340+ households with repeated mixed-waste disposal. Deploy additional segregation helpers on weekdays.",
                  priority: "High",
                  priorityColor: "#f97316",
                },
                {
                  ward: "Ward 28",
                  compliance: 67,
                  issue: "Compliance dropped 4% this week",
                  rec: "Increase frequency of door-to-door awareness drives. Consider incentive program for households maintaining >80% compliance for 3 consecutive weeks.",
                  priority: "Medium",
                  priorityColor: "#f59e0b",
                },
                {
                  ward: "Ward 21",
                  compliance: 84,
                  issue: "Best performing ward",
                  rec: "Ward 21 is a model ward. Share their community awareness campaign materials with Ward 15 and Ward 28. Consider featuring as a city-wide success story.",
                  priority: "Info",
                  priorityColor: "#3b82f6",
                },
              ].map((item) => (
                <div
                  key={item.ward}
                  className="rounded-xl p-4"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{item.ward}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>{item.compliance}% compliance</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ color: item.priorityColor, background: item.priorityColor + "18" }}
                      >
                        {item.priority}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600, marginBottom: 4 }}>⚠️ {item.issue}</div>
                  <div style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.6 }}>💡 {item.rec}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
