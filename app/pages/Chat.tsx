"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";

import { ChatHeader } from "@/app/components/ChatHeader";
import { EmptyState } from "@/app//components/EmptyState";
import { MessageBubble } from "@/app/components/MessageBubble";
import { ChatInput, type ChatInputHandle } from "@/app/components/ChatInput";
import { TypingIndicator } from "@/app/components/TypingIndicator";

export default function Chat() {
  const [input, setInput] = useState("");
  const [hydration, setHydration] = useState<"loading" | "ready">("loading");
  const serverConversationIdRef = useRef<string | null>(null);
  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        credentials: "include",
        body: async () => ({ conversationId: serverConversationIdRef.current }),
        fetch: async (url, init) => {
          const res = await fetch(url, init);
          const id = res.headers.get("X-Conversation-Id");
          if (id) serverConversationIdRef.current = id;
          return res;
        },
      })
  );

  const { messages, sendMessage, setMessages, status, stop, error } = useChat({
    transport,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/chat/conversation", { credentials: "include" });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as {
          conversationId: string | null;
          messages: UIMessage[];
        };
        if (cancelled) return;
        if (data.conversationId) {
          serverConversationIdRef.current = data.conversationId;
        }
        if (data.messages?.length) {
          setMessages(data.messages);
        }
      } finally {
        if (!cancelled) setHydration("ready");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setMessages]);

  const inputRef = useRef<ChatInputHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isStreaming = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 160;
    if (nearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isStreaming]);

  const handleSubmit = useCallback(() => {
    const md = (inputRef.current?.getMarkdown() ?? "").trim();
    const trimmed = md || input.trim();
    if (!trimmed || isStreaming) return;
    sendMessage({ text: trimmed });
    setInput("");
  }, [input, isStreaming, sendMessage]);

  const handlePickSuggestion = useCallback(
    (prompt: string) => {
      setInput(prompt);
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    []
  );

  const handleReset = useCallback(() => {
    if (isStreaming) stop();
    void fetch("/api/chat/conversation", {
      method: "DELETE",
      credentials: "include",
    });
    serverConversationIdRef.current = null;
    setMessages([]);
    setInput("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [isStreaming, setMessages, stop]);
  
  const lastMessage = messages[messages.length - 1];
  const showPendingAssistant =
    status === "submitted" &&
    (!lastMessage || lastMessage.role === "user");

  if (hydration === "loading") {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background text-sm text-foreground-muted">
        Loading chat…
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full flex-col bg-background">
      <ChatHeader hasMessages={hasMessages} onReset={handleReset} />

      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {!hasMessages ? (
          <EmptyState onPickSuggestion={handlePickSuggestion} />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-8 sm:px-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {showPendingAssistant && (
              <div className="fade-in-up flex w-full gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border-default bg-surface-elevated font-mono text-[10px] font-semibold text-foreground">
                  dsa
                </div>
                <div className="rounded-2xl rounded-bl-md border border-border-default bg-surface px-3.5 py-2.5">
                  <TypingIndicator />
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/6 px-3.5 py-3 text-sm text-red-300"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">Something went wrong</span>
                  <span className="text-xs text-red-300/80">
                    {error.message || "Please try again."}
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} aria-hidden className="h-1" />
          </div>
        )}
      </div>

      <ChatInput
        ref={inputRef}
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        onStop={stop}
        isStreaming={isStreaming}
      />
    </div>
  );
}
