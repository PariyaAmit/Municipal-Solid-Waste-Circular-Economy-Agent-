"use client";

import { useState } from "react";
import { MapPin, Truck, Zap, Clock, Navigation, CheckCircle, Circle, AlertTriangle } from "lucide-react";

interface RoutePoint {
  id: string;
  name: string;
  address: string;
  type: "start" | "collection" | "priority" | "end";
  wasteKg: number;
  completed: boolean;
  x: number;
  y: number;
}

const DEMO_VEHICLES = [
  { id: "V-101", name: "Vehicle V-101", ward: "Ward 12", capacity: 2000, driver: "Rajesh Kumar" },
  { id: "V-102", name: "Vehicle V-102", ward: "Ward 15", capacity: 3000, driver: "Suresh Patel" },
  { id: "V-103", name: "Vehicle V-103", ward: "Ward 21", capacity: 2500, driver: "Mehul Desai" },
  { id: "V-104", name: "Vehicle V-104", ward: "Ward 28", capacity: 1800, driver: "Anil Shah" },
];

const DEMO_ROUTES: Record<string, RoutePoint[]> = {
  "V-101": [
    { id: "P1", name: "Municipal Depot", address: "Sector 1, Ward 12", type: "start", wasteKg: 0, completed: true, x: 10, y: 50 },
    { id: "P2", name: "Market Area Bin", address: "Main Market, Ward 12", type: "priority", wasteKg: 450, completed: true, x: 25, y: 30 },
    { id: "P3", name: "Residential Zone A", address: "Block A, Sector 3", type: "collection", wasteKg: 280, completed: true, x: 42, y: 20 },
    { id: "P4", name: "Community Center", address: "Civic Center Rd", type: "collection", wasteKg: 190, completed: false, x: 58, y: 40 },
    { id: "P5", name: "Residential Zone B", address: "Block B, Sector 4", type: "collection", wasteKg: 310, completed: false, x: 70, y: 65 },
    { id: "P6", name: "School Complex", address: "Near Primary School", type: "priority", wasteKg: 220, completed: false, x: 82, y: 45 },
    { id: "P7", name: "Transfer Station", address: "Ward 12 Dump Yard", type: "end", wasteKg: 0, completed: false, x: 90, y: 75 },
  ],
  "V-102": [
    { id: "P1", name: "Ward 15 Depot", address: "Depot Road, Ward 15", type: "start", wasteKg: 0, completed: false, x: 15, y: 45 },
    { id: "P2", name: "Hospital Zone", address: "Near Civil Hospital", type: "priority", wasteKg: 380, completed: false, x: 30, y: 25 },
    { id: "P3", name: "Apartment Complex", address: "Sunrise Towers", type: "collection", wasteKg: 520, completed: false, x: 50, y: 35 },
    { id: "P4", name: "Street Market", address: "Gandhi Bazar", type: "priority", wasteKg: 640, completed: false, x: 65, y: 55 },
    { id: "P5", name: "Transfer Station", address: "Ward 15 Processing", type: "end", wasteKg: 0, completed: false, x: 85, y: 70 },
  ],
};

const POINT_COLORS = {
  start: "#10b981",
  collection: "#3b82f6",
  priority: "#f97316",
  end: "#8b5cf6",
};

export default function RoutesPage() {
  const [selectedVehicle, setSelectedVehicle] = useState(DEMO_VEHICLES[0]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState("");

  const points = DEMO_ROUTES[selectedVehicle.id] || DEMO_ROUTES["V-101"];
  const totalWaste = points.reduce((s, p) => s + p.wasteKg, 0);
  const completedPoints = points.filter((p) => p.completed).length;

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setOptimized(false);
    setAiRecommendation("");
    await new Promise((r) => setTimeout(r, 2200));
    setOptimized(true);
    setAiRecommendation(
      `**Optimized Route for ${selectedVehicle.name} — ${selectedVehicle.ward}**\n\n` +
      `**Route Summary:**\n` +
      `- Total stops: ${points.length}\n` +
      `- Estimated distance: ${(Math.random() * 5 + 8).toFixed(1)} km\n` +
      `- Estimated duration: ${Math.floor(Math.random() * 30 + 90)} minutes\n` +
      `- Total waste capacity: ${totalWaste} kg / ${selectedVehicle.capacity} kg\n\n` +
      `**Priority Stops (High-waste first):**\n` +
      points.filter((p) => p.type === "priority").map((p) => `- 🔴 ${p.name} — ${p.wasteKg} kg (${p.address})`).join("\n") + "\n\n" +
      `**AI Recommendations:**\n` +
      `- Skip residential Zone B until tomorrow — waste level below threshold\n` +
      `- Market Area Bin requires immediate attention — overflowing detected\n` +
      `- Optimal departure time: 6:30 AM to avoid morning traffic\n\n` +
      `*Route data is simulated for demonstration. Real-time GPS and IoT integration would optimize further.*`
    );
    setIsOptimizing(false);
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
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Route Optimization</h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              AI-powered waste collection route planning
            </p>
          </div>
          <span className="px-2 py-1 rounded-md text-xs font-semibold" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
            DEMO DATA
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 p-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_VEHICLES.map((v) => (
              <button
                key={v.id}
                onClick={() => { setSelectedVehicle(v); setOptimized(false); setAiRecommendation(""); }}
                className="rounded-xl p-4 text-left transition-all duration-150"
                style={{
                  background: selectedVehicle.id === v.id ? "rgba(16,185,129,0.08)" : "var(--card-bg)",
                  border: selectedVehicle.id === v.id ? "2px solid #10b981" : "1px solid var(--border)",
                  boxShadow: selectedVehicle.id === v.id ? "0 0 0 4px rgba(16,185,129,0.06)" : "var(--shadow)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: selectedVehicle.id === v.id ? "rgba(16,185,129,0.15)" : "var(--sidebar-bg)" }}>
                    <Truck size={16} color={selectedVehicle.id === v.id ? "#10b981" : "var(--muted)"} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 13, color: selectedVehicle.id === v.id ? "#10b981" : "var(--foreground)" }}>{v.id}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{v.ward}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{v.driver}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{v.capacity} kg capacity</div>
              </button>
            ))}
          </div>

          {/* Map visualization */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--border)", background: "var(--sidebar-bg)" }}
            >
              <div className="flex items-center gap-2">
                <Navigation size={15} color="#10b981" />
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  Route Map — {selectedVehicle.ward}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: "var(--muted)" }}>
                {Object.entries(POINT_COLORS).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-1">
                    <span className="rounded-full inline-block" style={{ width: 8, height: 8, background: color }} />
                    <span className="capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SVG map */}
            <div style={{ padding: 16, background: "#f0fdf4", minHeight: 280, position: "relative" }}>
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: 260, overflow: "visible" }}>
                {/* Grid lines */}
                {[20, 40, 60, 80].map((v) => (
                  <g key={v}>
                    <line x1={v} y1={0} x2={v} y2={100} stroke="#d1fae5" strokeWidth={0.3} />
                    <line x1={0} y1={v} x2={100} y2={v} stroke="#d1fae5" strokeWidth={0.3} />
                  </g>
                ))}

                {/* Route path */}
                {points.length > 1 && (
                  <polyline
                    points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke={optimized ? "#10b981" : "#94a3b8"}
                    strokeWidth={optimized ? 1.2 : 0.8}
                    strokeDasharray={optimized ? "none" : "2,2"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.8}
                  />
                )}

                {/* Directional arrows */}
                {optimized && points.slice(0, -1).map((p, idx) => {
                  const next = points[idx + 1];
                  const midX = (p.x + next.x) / 2;
                  const midY = (p.y + next.y) / 2;
                  return <circle key={idx} cx={midX} cy={midY} r={0.8} fill="#10b981" opacity={0.6} />;
                })}

                {/* Points */}
                {points.map((point, idx) => (
                  <g key={point.id}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={point.type === "priority" ? 3.5 : 2.8}
                      fill={POINT_COLORS[point.type]}
                      opacity={point.completed ? 0.5 : 1}
                      stroke="white"
                      strokeWidth={0.8}
                    />
                    {point.completed && (
                      <circle cx={point.x} cy={point.y} r={1.4} fill="white" />
                    )}
                    <text
                      x={point.x + 4}
                      y={point.y + 1}
                      fontSize="3.5"
                      fill="#374151"
                      fontWeight={point.type === "priority" ? "bold" : "normal"}
                    >
                      {point.name.split(" ").slice(0, 2).join(" ")}
                    </text>
                    <text x={point.x - 1.5} y={point.y + 1.5} fontSize="2.8" fill="white" fontWeight="bold">
                      {idx + 1}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Progress bar */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-between text-xs mb-1" style={{ color: "#374151" }}>
                  <span>Route Progress</span>
                  <span>{completedPoints}/{points.length} stops</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: 6, background: "#d1fae5" }}>
                  <div
                    className="rounded-full transition-all duration-500"
                    style={{ height: "100%", width: `${(completedPoints / points.length) * 100}%`, background: "linear-gradient(90deg, #10b981, #059669)" }}
                  />
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 divide-x" style={{ borderTop: "1px solid var(--border)" }}>
              {[
                { label: "Total Stops", value: points.length, icon: MapPin },
                { label: "Completed", value: completedPoints, icon: CheckCircle },
                { label: "Waste Load", value: `${totalWaste}kg`, icon: Truck },
                { label: "Capacity", value: `${Math.round((totalWaste / selectedVehicle.capacity) * 100)}%`, icon: AlertTriangle },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="px-4 py-3 flex items-center gap-2">
                  <Icon size={14} color="#10b981" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{value}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)" }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Route stops list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
            >
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)", background: "var(--sidebar-bg)" }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Collection Stops</span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {points.map((point, idx) => (
                  <div
                    key={point.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                    style={{ background: point.completed ? "var(--sidebar-bg)" : "transparent", opacity: point.completed ? 0.6 : 1 }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full flex-shrink-0 text-white text-xs font-bold"
                      style={{ width: 24, height: 24, background: POINT_COLORS[point.type], fontSize: 10 }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontWeight: 600, fontSize: 12 }}>{point.name}</div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>{point.address}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {point.wasteKg > 0 && (
                        <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>{point.wasteKg}kg</span>
                      )}
                      <span
                        className="px-1.5 py-0.5 rounded-full text-xs font-semibold capitalize"
                        style={{ color: POINT_COLORS[point.type], background: POINT_COLORS[point.type] + "18" }}
                      >
                        {point.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation */}
            <div
              className="rounded-2xl flex flex-col"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
            >
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)", background: "var(--sidebar-bg)" }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>AI Optimization</span>
                <button
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: isOptimizing ? "var(--border)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: isOptimizing ? "var(--muted)" : "white",
                    cursor: isOptimizing ? "not-allowed" : "pointer",
                  }}
                >
                  <Zap size={14} className={isOptimizing ? "animate-spin-slow" : ""} />
                  {isOptimizing ? "Optimizing..." : "Optimize Route"}
                </button>
              </div>
              <div className="flex-1 p-4" style={{ minHeight: 200 }}>
                {!optimized && !isOptimizing && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center" style={{ color: "var(--muted)" }}>
                    <Zap size={32} style={{ opacity: 0.2 }} />
                    <p style={{ fontSize: 13 }}>Click "Optimize Route" to generate an AI-powered route recommendation for {selectedVehicle.name}.</p>
                  </div>
                )}
                {isOptimizing && (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="rounded-full animate-pulse-dot" style={{ width: 8, height: 8, background: "#10b981", animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>Analyzing route data with AI...</p>
                  </div>
                )}
                {optimized && aiRecommendation && (
                  <div className="prose" style={{ fontSize: 12 }}>
                    <div className="flex items-center gap-1.5 mb-3">
                      <CheckCircle size={14} color="#10b981" />
                      <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>Route optimized successfully</span>
                    </div>
                    {aiRecommendation.split("\n").map((line, i) => {
                      if (line.startsWith("**") && line.endsWith("**")) {
                        return <div key={i} style={{ fontWeight: 700, marginTop: 8, marginBottom: 2, fontSize: 12 }}>{line.replace(/\*\*/g, "")}</div>;
                      }
                      if (line.startsWith("- ")) {
                        return <div key={i} style={{ marginLeft: 12, marginBottom: 2, fontSize: 12 }}>{line}</div>;
                      }
                      if (line.startsWith("*") && line.endsWith("*")) {
                        return <div key={i} style={{ fontStyle: "italic", color: "var(--muted)", marginTop: 8, fontSize: 11 }}>{line.replace(/\*/g, "")}</div>;
                      }
                      return line ? <div key={i} style={{ marginBottom: 2, fontSize: 12 }}>{line}</div> : <div key={i} style={{ height: 6 }} />;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
