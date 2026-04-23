import { RotateCcw } from "lucide-react";

interface ChatHeaderProps {
  hasMessages: boolean;
  onReset: () => void;
}

export function ChatHeader({ hasMessages, onReset }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border-subtle bg-(--background)/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-7 w-7 place-items-center rounded-md border border-border-default bg-surface font-mono text-[11px] font-semibold tracking-tight text-foreground">
            dsa
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              DSA Coach
            </span>
            <span className="text-[11px] text-foreground-subtle">
              Hint-driven practice, not answers
            </span>
          </div>
        </div>

        {hasMessages && (
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-md border border-border-default bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground-muted transition-colors hover:bg-surface-elevated hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Start a new conversation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New chat
          </button>
        )}
      </div>
    </header>
  );
}
