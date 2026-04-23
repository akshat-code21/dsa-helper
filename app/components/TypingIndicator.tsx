export function TypingIndicator() {
  return (
    <div
      className="inline-flex items-center gap-1 py-1"
      role="status"
      aria-label="Assistant is thinking"
    >
      <span
        className="typing-dot h-1.5 w-1.5 rounded-full bg-foreground-subtle"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="typing-dot h-1.5 w-1.5 rounded-full bg-foreground-subtle"
        style={{ animationDelay: "160ms" }}
      />
      <span
        className="typing-dot h-1.5 w-1.5 rounded-full bg-foreground-subtle"
        style={{ animationDelay: "320ms" }}
      />
    </div>
  );
}
