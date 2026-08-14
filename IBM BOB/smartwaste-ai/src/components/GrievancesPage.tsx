"use client";

import { DEMO_GRIEVANCES, COMPLAINT_CATEGORIES } from "@/lib/demo-data";
import { Grievance } from "@/lib/types";
import { useState } from "react";
import { AlertCircle, CheckCircle, Clock, Plus, Search, Filter, ChevronDown, X } from "lucide-react";

const PRIORITY_COLORS: Record<string, string> = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#f97316",
  Critical: "#ef4444",
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  New: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)", icon: AlertCircle },
  Assigned: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: Clock },
  "In Progress": { color: "#f97316", bg: "rgba(249,115,22,0.1)", icon: Clock },
  Resolved: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", icon: CheckCircle },
};

const WARDS = ["All Wards", "Ward 12", "Ward 15", "Ward 21", "Ward 28"];
const PRIORITIES = ["All", "Low", "Medium", "High", "Critical"];
const STATUSES = ["All", "New", "Assigned", "In Progress", "Resolved"];

export default function GrievancesPage() {
  const [grievances] = useState<Grievance[]>(DEMO_GRIEVANCES);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [search, setSearch] = useState("");
  const [filterWard, setFilterWard] = useState("All Wards");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const filtered = grievances.filter((g) => {
    if (search && !g.citizen.toLowerCase().includes(search.toLowerCase()) && !g.description.toLowerCase().includes(search.toLowerCase()) && !g.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterWard !== "All Wards" && g.ward !== filterWard) return false;
    if (filterPriority !== "All" && g.priority !== filterPriority) return false;
    if (filterStatus !== "All" && g.status !== filterStatus) return false;
    if (filterCategory !== "All" && g.category !== filterCategory) return false;
    return true;
  });

  const stats = {
    total: grievances.length,
    new: grievances.filter((g) => g.status === "New").length,
    inProgress: grievances.filter((g) => g.status === "In Progress" || g.status === "Assigned").length,
    resolved: grievances.filter((g) => g.status === "Resolved").length,
    critical: grievances.filter((g) => g.priority === "Critical").length,
  };

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div
        className="px-6 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--card-bg)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Grievance Management</h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              Citizen complaints and municipal service requests
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-1 rounded-md text-xs font-semibold"
              style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}
            >
              DEMO DATA
            </span>
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white" }}
            >
              <Plus size={14} />
              New Complaint
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 mt-4 overflow-x-auto pb-1">
          {[
            { label: "Total", value: stats.total, color: "#6366f1" },
            { label: "New", value: stats.new, color: "#3b82f6" },
            { label: "Active", value: stats.inProgress, color: "#f97316" },
            { label: "Resolved", value: stats.resolved, color: "#22c55e" },
            { label: "Critical", value: stats.critical, color: "#ef4444" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex-shrink-0 rounded-xl px-4 py-2.5 text-center"
              style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", minWidth: 80 }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div
        className="px-6 py-3 flex flex-wrap gap-2 items-center flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--sidebar-bg)" }}
      >
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 flex-1"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)", minWidth: 180, maxWidth: 280 }}
        >
          <Search size={13} style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--foreground)" }}
          />
        </div>
        {[
          { value: filterWard, options: WARDS, onChange: setFilterWard },
          { value: filterCategory, options: ["All", ...COMPLAINT_CATEGORIES], onChange: setFilterCategory },
          { value: filterPriority, options: PRIORITIES, onChange: setFilterPriority },
          { value: filterStatus, options: STATUSES, onChange: setFilterStatus },
        ].map((f, i) => (
          <select
            key={i}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-sm outline-none"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--foreground)", cursor: "pointer" }}
          >
            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2" style={{ color: "var(--muted)" }}>
            <Filter size={32} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: 14 }}>No complaints found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--sidebar-bg)" }}>
                  {["ID", "Date", "Citizen", "Category", "Ward", "Priority", "Department", "Status", "Action"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold"
                      style={{ color: "var(--muted)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.05em" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, idx) => {
                  const statusConf = STATUS_CONFIG[g.status];
                  const StatusIcon = statusConf.icon;
                  return (
                    <tr
                      key={g.id}
                      style={{ borderBottom: "1px solid var(--border)", background: idx % 2 === 0 ? "transparent" : "var(--sidebar-bg)" }}
                      className="hover:bg-opacity-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: "#10b981", fontWeight: 600 }}>{g.id}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{g.date}</td>
                      <td className="px-4 py-3 text-sm font-medium">{g.citizen}</td>
                      <td className="px-4 py-3 text-xs" style={{ whiteSpace: "nowrap" }}>{g.category}</td>
                      <td className="px-4 py-3 text-xs font-medium">{g.ward}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ color: PRIORITY_COLORS[g.priority], background: PRIORITY_COLORS[g.priority] + "18" }}
                        >
                          {g.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{g.department}</td>
                      <td className="px-4 py-3">
                        <span
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold w-fit"
                          style={{ color: statusConf.color, background: statusConf.bg, whiteSpace: "nowrap" }}
                        >
                          <StatusIcon size={10} />
                          {g.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedGrievance(g)}
                          className="text-xs px-2 py-1 rounded-lg font-medium transition-colors"
                          style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedGrievance && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setSelectedGrievance(null)}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-lg animate-fade-in"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Complaint Details</h2>
              <button onClick={() => setSelectedGrievance(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: "Complaint ID", value: selectedGrievance.id },
                { label: "Date", value: selectedGrievance.date },
                { label: "Citizen", value: selectedGrievance.citizen },
                { label: "Category", value: selectedGrievance.category },
                { label: "Ward", value: selectedGrievance.ward },
                { label: "Location", value: selectedGrievance.location || "Not specified" },
                { label: "Department", value: selectedGrievance.department },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <span style={{ minWidth: 120, color: "var(--muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", paddingTop: 2 }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: 13 }}>{item.value}</span>
                </div>
              ))}
              <div className="flex gap-3 items-center">
                <span style={{ minWidth: 120, color: "var(--muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Priority</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: PRIORITY_COLORS[selectedGrievance.priority], background: PRIORITY_COLORS[selectedGrievance.priority] + "18" }}>
                  {selectedGrievance.priority}
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <span style={{ minWidth: 120, color: "var(--muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Status</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: STATUS_CONFIG[selectedGrievance.status].color, background: STATUS_CONFIG[selectedGrievance.status].bg }}>
                  {selectedGrievance.status}
                </span>
              </div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4 }}>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Description</div>
                <p style={{ fontSize: 13, lineHeight: 1.6 }}>{selectedGrievance.description}</p>
              </div>
              {selectedGrievance.aiClassification && (
                <div
                  className="rounded-xl p-3"
                  style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  <div style={{ fontSize: 11, color: "#10b981", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                    🤖 AI Classification
                  </div>
                  <p style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.5 }}>{selectedGrievance.aiClassification}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
