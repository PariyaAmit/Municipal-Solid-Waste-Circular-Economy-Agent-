import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const runtime = "nodejs";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  if (!GROQ_API_KEY) {
    return NextResponse.json(
      { error: "AI service is not configured. Please contact the administrator." },
      { status: 503 }
    );
  }

  let body: { messages?: { role: string; content: string }[]; systemPrompt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request format." }, { status: 400 });
  }

  const { messages, systemPrompt } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  // Validate messages
  const validMessages = messages.filter(
    (m) =>
      m &&
      typeof m.role === "string" &&
      typeof m.content === "string" &&
      m.content.trim().length > 0 &&
      (m.role === "user" || m.role === "assistant")
  );

  if (validMessages.length === 0) {
    return NextResponse.json({ error: "No valid messages provided." }, { status: 400 });
  }

  // Limit conversation history to last 20 messages to avoid token limits
  const recentMessages = validMessages.slice(-20);

  try {
    const groq = new Groq({ apiKey: GROQ_API_KEY });

    const allMessages: Groq.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          systemPrompt ||
          `You are SmartWaste AI, an intelligent municipal waste management assistant. Be helpful, concise, accurate, and professional. Support English, Hindi, and Gujarati. Reply in the same language as the user.`,
      },
      ...recentMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: allMessages,
      max_tokens: 2048,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "The AI did not return a response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ content });
  } catch (err: unknown) {
    console.error("Groq API error:", err);

    const error = err as { status?: number; message?: string; code?: string };

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit reached. Please wait a moment and try again." },
        { status: 429 }
      );
    }
    if (error?.status === 401) {
      return NextResponse.json(
        { error: "AI service authentication failed. Please contact the administrator." },
        { status: 401 }
      );
    }
    if (error?.code === "ECONNREFUSED" || error?.code === "ETIMEDOUT") {
      return NextResponse.json(
        { error: "Could not connect to the AI service. Please check your connection." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "SmartWaste AI is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
