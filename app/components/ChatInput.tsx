"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ArrowUp, Square } from "lucide-react";

export interface ChatInputHandle {
  focus: () => void;
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

const MAX_HEIGHT = 200;

export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  function ChatInput(
    { value, onChange, onSubmit, onStop, isStreaming, disabled },
    ref
  ) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
    }));

    useEffect(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
    }, [value]);

    const canSubmit = !disabled && !isStreaming && value.trim().length > 0;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!canSubmit) return;
      onSubmit();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }
    };

    return (
      <div className="pointer-events-none sticky bottom-0 z-10 bg-linear-to-t from-background via-(--background)/95 to-transparent pb-4 pt-6">
        <div className="pointer-events-auto mx-auto w-full max-w-3xl px-4 sm:px-6">
          <form
            onSubmit={handleSubmit}
            className="group relative flex items-end gap-2 rounded-2xl border border-border-default bg-surface p-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] transition-colors focus-within:border-foreground-subtle"
          >
            <label htmlFor="chat-input" className="sr-only">
              Message
            </label>
            <textarea
              id="chat-input"
              ref={textareaRef}
              rows={1}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for a hint, share your approach, or paste a problem link…"
              disabled={disabled}
              className="flex-1 resize-none bg-transparent px-2.5 py-2 text-sm leading-relaxed text-foreground placeholder:text-foreground-subtle focus:outline-none disabled:opacity-60"
              style={{ maxHeight: MAX_HEIGHT }}
            />

            {isStreaming && onStop ? (
              <button
                type="button"
                onClick={onStop}
                className="cursor-pointer inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-default bg-surface-elevated text-foreground transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Stop generating"
              >
                <Square className="h-4 w-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canSubmit}
                className="cursor-pointer inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-surface-elevated disabled:text-foreground-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Send message"
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
              </button>
            )}
          </form>

          <p className="mt-2 text-center text-[11px] text-foreground-subtle">
            <kbd className="rounded border border-border-default bg-surface px-1 py-0.5 font-mono text-[10px]">
              Enter
            </kbd>{" "}
            to send ·{" "}
            <kbd className="rounded border border-border-default bg-surface px-1 py-0.5 font-mono text-[10px]">
              Shift + Enter
            </kbd>{" "}
            for a new line
          </p>
        </div>
      </div>
    );
  }
);
