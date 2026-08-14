import { Conversation, Message, AppSettings } from "./types";
import { AgentType } from "./types";
import { generateId } from "./utils";
import { getAgent } from "./agents";

const CONVERSATIONS_KEY = "smartwaste_conversations";
const SETTINGS_KEY = "smartwaste_settings";

export function getConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CONVERSATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function createConversation(agentType: AgentType = "assistant"): Conversation {
  const agent = getAgent(agentType);
  const welcomeMessage: Message = {
    id: generateId(),
    role: "assistant",
    content: agent.greeting,
    timestamp: new Date().toISOString(),
    agentType,
  };
  return {
    id: generateId(),
    title: "New Conversation",
    messages: [welcomeMessage],
    agentType,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function updateConversationTitle(
  conversations: Conversation[],
  id: string,
  firstUserMessage: string
): Conversation[] {
  const title =
    firstUserMessage.length > 40
      ? firstUserMessage.substring(0, 40) + "..."
      : firstUserMessage;
  return conversations.map((c) => (c.id === id ? { ...c, title } : c));
}

export function deleteConversation(
  conversations: Conversation[],
  id: string
): Conversation[] {
  return conversations.filter((c) => c.id !== id);
}

export function getSettings(): AppSettings {
  if (typeof window === "undefined") {
    return {
      theme: "system",
      language: "en",
      aiModel: "llama-3.3-70b-versatile",
      responseStyle: "balanced",
      demoMode: true,
      notifications: true,
    };
  }
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data
      ? JSON.parse(data)
      : {
          theme: "system",
          language: "en",
          aiModel: "llama-3.3-70b-versatile",
          responseStyle: "balanced",
          demoMode: true,
          notifications: true,
        };
  } catch {
    return {
      theme: "system",
      language: "en",
      aiModel: "llama-3.3-70b-versatile",
      responseStyle: "balanced",
      demoMode: true,
      notifications: true,
    };
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
