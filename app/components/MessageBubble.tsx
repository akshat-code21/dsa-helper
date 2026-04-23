"use client";

import { useState } from "react";
import { ChevronDown, User, MessageSquare, Lightbulb, Cloud } from "lucide-react";
import type { UIMessage } from "ai";
import { TypingIndicator } from "./TypingIndicator";

interface MessageBubbleProps {
  message: UIMessage;
}

/**
 * Best-effort parse for the assistant's structured JSON response
 * ({ feedback, hint }). Handles partial/streaming payloads by
 * extracting string values even if the JSON isn't yet complete.
 */
function parseFeedbackHint(text: string): { feedback?: string; hint?: string } | null {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{")) return null;

  try {
    const parsed = JSON.parse(trimmed);
    if (
      parsed &&
      typeof parsed === "object" &&
      ("feedback" in parsed || "hint" in parsed)
    ) {
      return {
        feedback: typeof parsed.feedback === "string" ? parsed.feedback : undefined,
        hint: typeof parsed.hint === "string" ? parsed.hint : undefined,
      };
    }
    return null;
  } catch {
    const extract = (key: string): string | undefined => {
      const re = new RegExp(`"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)`, "s");
      const m = trimmed.match(re);
      if (!m) return undefined;
      try {
        return JSON.parse(`"${m[1]}"`);
      } catch {
        return m[1];
      }
    };
    const feedback = extract("feedback");
    const hint = extract("hint");
    if (feedback || hint) return { feedback, hint };
    return null;
  }
}

function Avatar({ role }: { role: "user" | "assistant" }) {
  if (role === "user") {
    return (
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border-default bg-surface text-foreground-muted">
        <User className="h-3.5 w-3.5" strokeWidth={2} />
      </div>
    );
  }
  return (
    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border-default bg-surface-elevated font-mono text-[10px] font-semibold text-foreground">
      ds
    </div>
  );
}

function ReasoningBlock({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border-subtle bg-(--surface)/60">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground-muted transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5" />
          Reasoning
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="whitespace-pre-wrap border-t border-border-subtle px-3 py-2.5 text-xs leading-relaxed text-foreground-muted">
          {text}
        </div>
      )}
    </div>
  );
}

function FeedbackHintCards({
  feedback,
  hint,
}: {
  feedback?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {feedback && (
        <div className="rounded-xl border border-border-default bg-surface p-3.5">
          <div className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-foreground-subtle">
            <MessageSquare className="h-3 w-3" strokeWidth={2.25} />
            Feedback
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {feedback}
          </p>
        </div>
      )}
      {hint && (
        <div className="rounded-xl border border-amber-500/15 bg-amber-500/4 p-3.5">
          <div className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-amber-200/80">
            <Lightbulb className="h-3 w-3" strokeWidth={2.25} />
            Hint
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {hint}
          </p>
        </div>
      )}
    </div>
  );
}

function WeatherToolCard({ part }: { part: unknown }) {
  const p = part as {
    output?: { location?: string; temperature?: number };
    input?: { location?: string };
    state?: string;
  };
  const location = p.output?.location ?? p.input?.location ?? "Unknown";
  const temperature = p.output?.temperature;
  const pending = temperature === undefined;

  return (
    <div className="inline-flex items-center gap-2.5 rounded-xl border border-border-default bg-surface px-3 py-2 text-sm">
      <Cloud className="h-4 w-4 text-foreground-muted" strokeWidth={2} />
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] uppercase tracking-wide text-foreground-subtle">
          Weather · {location}
        </span>
        <span className="text-foreground">
          {pending ? "Fetching…" : `${temperature}°F`}
        </span>
      </div>
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`fade-in-up flex w-full gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && <Avatar role="assistant" />}

      <div
        className={`flex min-w-0 max-w-[85%] flex-col gap-2 sm:max-w-[78%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {message.parts.map((part, i) => {
          const key = `${message.id}-${i}`;

          if (
            (part.type === "text" || part.type === "reasoning") &&
            "state" in part &&
            part.state === "streaming" &&
            !("text" in part && part.text)
          ) {
            return (
              <div
                key={key}
                className="rounded-2xl border border-border-default bg-surface px-3.5 py-2.5"
              >
                <TypingIndicator />
              </div>
            );
          }

          switch (part.type) {
            case "text": {
              const text = part.text ?? "";
              if (isUser) {
                return (
                  <div
                    key={key}
                    className="whitespace-pre-wrap wrap-break-word rounded-2xl rounded-br-md border border-border-default bg-surface-elevated px-3.5 py-2 text-sm leading-relaxed text-foreground"
                  >
                    {text}
                  </div>
                );
              }

              const structured = parseFeedbackHint(text);
              if (structured && (structured.feedback || structured.hint)) {
                return (
                  <div key={key} className="w-full">
                    <FeedbackHintCards
                      feedback={structured.feedback}
                      hint={structured.hint}
                    />
                  </div>
                );
              }

              return (
                <div
                  key={key}
                  className="whitespace-pre-wrap wrap-break-word rounded-2xl rounded-bl-md border border-border-default bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-foreground"
                >
                  {text}
                </div>
              );
            }
            case "reasoning":
              return <ReasoningBlock key={key} text={part.text ?? ""} />;
            case "tool-weather":
              return <WeatherToolCard key={key} part={part} />;
            default:
              return null;
          }
        })}
      </div>

      {isUser && <Avatar role="user" />}
    </div>
  );
}
