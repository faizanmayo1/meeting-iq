import { ArrowUp, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "What did we decide about the Q3 enterprise rollout?",
  "Which team's meetings produced the most outcomes this month?",
  "Show me overdue actions across Product",
];

export function CopilotPromptBar() {
  return (
    <div className="ai-edge group rounded-xl bg-surface p-4 transition-all">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 shrink-0 rounded-md bg-gradient-to-br from-brand-500 to-accent-500 grid place-items-center text-ink-invert shadow-elev-1">
          <Sparkles className="h-4 w-4" strokeWidth={2.25} />
        </div>
        <input
          type="text"
          placeholder="Ask MeetingIQ anything — “What changed in our decision velocity this week?”"
          className="flex-1 h-9 bg-transparent border-0 text-body text-ink-primary placeholder:text-ink-muted focus:outline-none"
        />
        <button className="h-9 w-9 grid place-items-center rounded-md bg-ink-primary text-ink-invert hover:bg-ink-primary/90 transition-colors disabled:opacity-50">
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-caption uppercase tracking-[0.1em] text-ink-muted mr-1">Try</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="text-body-sm text-ink-secondary hover:text-ink-primary px-2.5 py-1 rounded-full bg-subtle/60 hover:bg-subtle border border-border-soft transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
