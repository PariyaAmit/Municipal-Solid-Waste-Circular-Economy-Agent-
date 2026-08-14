"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square, Mic, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop: () => void;
  disabled?: boolean;
}

const SUGGESTIONS = [
  "Report missed garbage collection",
  "How can I improve waste segregation?",
  "Optimize today's collection route",
  "Show ward waste trends",
  "Register a municipal complaint",
];

export default function ChatInput({ onSend, isLoading, onStop, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim() || isLoading || disabled) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [input]);

  return (
    <div className="px-4 pb-4 pt-2">
      {/* Suggestions (only shown when input is empty) */}
      {!input && !isLoading && (
        <div className="flex flex-wrap gap-2 mb-3 justify-center">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setInput(s); textareaRef.current?.focus(); }}
              className="text-xs px-3 py-1.5 rounded-full transition-all duration-150"
              style={{
                background: "var(--sidebar-bg)",
                border: "1px solid var(--border)",
                color: "var(--muted)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input box */}
      <div
        className="flex items-end gap-2 rounded-2xl px-4 py-3 transition-shadow"
        style={{
          background: "var(--card-bg)",
          border: "1.5px solid var(--border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <button
          className="flex-shrink-0 p-1.5 rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: "var(--muted)" }}
          title="Attach file"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask SmartWaste AI anything about waste management..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed"
          style={{
            color: "var(--foreground)",
            minHeight: "24px",
            maxHeight: "160px",
          }}
        />

        <button
          className="flex-shrink-0 p-1.5 rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: "var(--muted)" }}
          title="Voice input"
        >
          <Mic size={18} />
        </button>

        {isLoading ? (
          <button
            onClick={onStop}
            className="flex-shrink-0 flex items-center justify-center rounded-xl transition-all duration-150"
            style={{
              width: 36,
              height: 36,
              background: "#ef4444",
              color: "white",
            }}
            title="Stop generating"
          >
            <Square size={14} fill="white" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className="flex-shrink-0 flex items-center justify-center rounded-xl transition-all duration-150"
            style={{
              width: 36,
              height: 36,
              background:
                input.trim() && !disabled
                  ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  : "var(--border)",
              color: input.trim() && !disabled ? "white" : "var(--muted)",
              cursor: input.trim() && !disabled ? "pointer" : "not-allowed",
            }}
            title="Send"
          >
            <Send size={15} />
          </button>
        )}
      </div>
      <div className="text-center mt-1.5" style={{ fontSize: 10, color: "var(--muted)" }}>
        SmartWaste AI may produce inaccurate information. Demo mode active.
      </div>
    </div>
  );
}
