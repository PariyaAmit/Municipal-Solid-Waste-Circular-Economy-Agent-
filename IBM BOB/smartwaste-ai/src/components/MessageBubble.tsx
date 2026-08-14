"use client";

import { Message } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Check, Loader2, User, Leaf } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isLast?: boolean;
  isLoading?: boolean;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  onRegenerate?: () => void;
}

export default function MessageBubble({
  message,
  isLast,
  isLoading,
  onLike,
  onDislike,
  onRegenerate,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            }}
          >
            <User size={16} color="white" />
          </div>
        ) : (
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            }}
          >
            <Leaf size={16} color="white" />
          </div>
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn("flex flex-col gap-1 max-w-[78%]", isUser ? "items-end" : "items-start")}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser ? "message-user rounded-tr-sm" : "message-ai rounded-tl-sm"
          )}
          style={{
            maxWidth: "100%",
            wordBreak: "break-word",
          }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2" style={{ color: "var(--muted)" }}>
              <Loader2 size={14} className="animate-spin-slow" />
              <span>SmartWaste AI is thinking...</span>
            </div>
          ) : isUser ? (
            <span style={{ whiteSpace: "pre-wrap" }}>{message.content}</span>
          ) : (
            <div className="prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div style={{ fontSize: 10, color: "var(--muted)", paddingLeft: isUser ? 0 : 4, paddingRight: isUser ? 4 : 0 }}>
          {formatTime(message.timestamp)}
        </div>

        {/* AI Actions */}
        {!isUser && !isLoading && (
          <div className="flex items-center gap-1">
            <button
              onClick={copyToClipboard}
              title="Copy"
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors hover:bg-gray-100"
              style={{ color: "var(--muted)" }}
            >
              {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={() => onLike?.(message.id)}
              title="Good response"
              className="p-1.5 rounded-md transition-colors hover:bg-gray-100"
              style={{ color: message.liked ? "#10b981" : "var(--muted)" }}
            >
              <ThumbsUp size={12} />
            </button>
            <button
              onClick={() => onDislike?.(message.id)}
              title="Poor response"
              className="p-1.5 rounded-md transition-colors hover:bg-gray-100"
              style={{ color: message.disliked ? "#ef4444" : "var(--muted)" }}
            >
              <ThumbsDown size={12} />
            </button>
            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                title="Regenerate"
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors hover:bg-gray-100"
                style={{ color: "var(--muted)" }}
              >
                <RotateCcw size={12} />
                Regenerate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
