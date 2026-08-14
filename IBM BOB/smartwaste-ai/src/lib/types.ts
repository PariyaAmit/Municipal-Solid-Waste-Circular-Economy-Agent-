export type AgentType =
  | "assistant"
  | "route"
  | "segregation"
  | "grievance"
  | "routing"
  | "analytics";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  agentType?: AgentType;
  liked?: boolean;
  disliked?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  agentType: AgentType;
  createdAt: string;
  updatedAt: string;
}

export interface Grievance {
  id: string;
  date: string;
  citizen: string;
  category: string;
  ward: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  department: string;
  status: "New" | "Assigned" | "In Progress" | "Resolved";
  description: string;
  location?: string;
  aiClassification?: string;
}

export interface WasteRoute {
  id: string;
  vehicle: string;
  ward: string;
  points: RoutePoint[];
  estimatedDistance: string;
  estimatedDuration: string;
  status: "Pending" | "Active" | "Completed";
}

export interface RoutePoint {
  id: string;
  name: string;
  address: string;
  type: "start" | "collection" | "priority" | "end";
  wasteQuantity?: string;
  lat: number;
  lng: number;
  completed?: boolean;
}

export interface WardStats {
  ward: string;
  wasteCollected: number;
  segregationCompliance: number;
  activeComplaints: number;
  resolvedComplaints: number;
  missedPickups: number;
  recyclingRate: number;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  language: "en" | "hi" | "gu";
  aiModel: string;
  responseStyle: "concise" | "detailed" | "balanced";
  demoMode: boolean;
  notifications: boolean;
}
