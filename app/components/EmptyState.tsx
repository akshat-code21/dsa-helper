import { Lightbulb, Target, BookOpen, Brain } from "lucide-react";

interface EmptyStateProps {
  onPickSuggestion: (prompt: string) => void;
}

const suggestions = [
  {
    icon: Target,
    title: "Start a problem",
    prompt:
      "I'm working on https://leetcode.com/problems/two-sum/ — can you guide me?",
  },
  {
    icon: Brain,
    title: "Check my approach",
    prompt:
      "My idea: use a hash map to store complements while iterating once. Is this on the right track?",
  },
  {
    icon: Lightbulb,
    title: "I'm stuck",
    prompt:
      "I tried brute force O(n^2) for two sum. I know it's slow — nudge me toward a better approach?",
  },
  {
    icon: BookOpen,
    title: "Understand a pattern",
    prompt:
      "Explain when a sliding window is the right pattern vs two pointers — without giving full code.",
  },
];

export function EmptyState({ onPickSuggestion }: EmptyStateProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center px-4 py-16 sm:py-24">
      <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        What are we solving today?
      </h1>
      <p className="mt-3 max-w-md text-center text-sm leading-relaxed text-foreground-muted">
        Drop a problem link or describe your attempt. You&apos;ll get one hint
        at a time — never the full solution.
      </p>

      <div className="mt-10 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
        {suggestions.map(({ icon: Icon, title, prompt }) => (
          <button
            key={title}
            type="button"
            onClick={() => onPickSuggestion(prompt)}
            className="cursor-pointer group flex flex-col gap-1.5 rounded-xl border border-border-default bg-surface p-4 text-left transition-colors hover:bg-surface-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="flex items-center gap-2">
              <Icon
                className="h-3.5 w-3.5 text-foreground-subtle transition-colors group-hover:text-foreground"
                strokeWidth={2}
              />
              <span className="text-xs font-medium text-foreground">
                {title}
              </span>
            </div>
            <p className="line-clamp-2 text-xs leading-relaxed text-foreground-muted">
              {prompt}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
