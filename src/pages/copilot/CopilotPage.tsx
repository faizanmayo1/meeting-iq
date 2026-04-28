import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Search,
  ArrowUp,
  Paperclip,
  Database,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { ChatTurnView } from "@/features/copilot/ChatTurn";
import { SEEDED_THREAD, SUGGESTED_PROMPTS, RECENT_THREADS } from "@/mocks/seed/copilot";
import type { ChatTurn } from "@/mocks/seed/copilot";
import { cn } from "@/lib/utils";

export default function CopilotPage() {
  const [turns, setTurns] = useState<ChatTurn[]>(SEEDED_THREAD);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns.length]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setTurns((t) => [
      ...t,
      { id: `u-${Date.now()}`, role: "user", text },
      {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: "On it — pulling that from your fleet data now…",
      },
    ]);
    setDraft("");
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-canvas">
      {/* Threads sidebar (in-page, not the global sidebar) */}
      <aside className="hidden md:flex w-[260px] shrink-0 flex-col border-r border-border-soft bg-surface">
        <div className="p-3 border-b border-border-soft">
          <button className="w-full h-9 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-br from-brand-500 to-accent-500 text-ink-invert text-body-sm font-medium hover:from-brand-600 hover:to-accent-700 transition-colors shadow-elev-1">
            <Plus className="h-4 w-4" />
            New conversation
          </button>
          <div className="relative mt-2.5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
            <input
              placeholder="Search threads"
              className="h-8 w-full pl-8 pr-3 text-body-sm rounded-md bg-subtle/60 border border-border-soft focus:outline-none focus:bg-surface focus:border-brand-500/40"
            />
          </div>
        </div>
        <div className="px-3 py-2 text-caption uppercase tracking-[0.1em] text-ink-muted">
          Recent
        </div>
        <ul className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
          {RECENT_THREADS.map((t) => (
            <li key={t.id}>
              <button
                className={cn(
                  "w-full text-left rounded-md px-2.5 py-2 transition-colors",
                  t.active
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-secondary hover:bg-subtle hover:text-ink-primary"
                )}
              >
                <div className="text-body-sm leading-tight line-clamp-2">{t.title}</div>
                <div className="text-[10px] text-ink-muted mt-1">{t.time}</div>
              </button>
            </li>
          ))}
        </ul>
        {/* Capability chips */}
        <div className="p-3 border-t border-border-soft space-y-1.5">
          <Capability icon={<Database className="h-3.5 w-3.5" />} label="Fleet data · 142 trucks" />
          <Capability icon={<Cpu className="h-3.5 w-3.5" />} label="Predictive · ETA + maintenance" />
          <Capability icon={<ShieldCheck className="h-3.5 w-3.5" />} label="SOC 2 · audit logged" />
        </div>
      </aside>

      {/* Conversation column */}
      <section className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <div className="px-6 lg:px-8 py-4 border-b border-border-soft bg-surface/80 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 max-w-3xl mx-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-md bg-gradient-to-br from-brand-500 to-accent-500 grid place-items-center text-ink-invert shadow-elev-1">
                <Sparkles className="h-4 w-4" strokeWidth={2.25} />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-h3 text-ink-primary tracking-tight truncate">
                  Worst lanes this month
                </h1>
                <p className="text-[11px] text-ink-muted">
                  Copilot · grounded in your TMS, telematics, and 30-day history
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-ink-muted px-2 py-1 rounded-full bg-subtle/60 border border-border-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" />
              Live data
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {turns.map((t) => (
              <ChatTurnView key={t.id} turn={t} onSuggest={send} />
            ))}
            <div ref={endRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border-soft bg-surface/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="ai-edge rounded-xl bg-surface p-2 flex items-end gap-2 shadow-elev-1">
              <button className="h-9 w-9 grid place-items-center rounded-md text-ink-muted hover:bg-subtle hover:text-ink-primary transition-colors shrink-0">
                <Paperclip className="h-4 w-4" />
              </button>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(draft);
                  }
                }}
                placeholder="Ask anything about your fleet — “Why is Memphis dwell up this week?”"
                rows={1}
                className="flex-1 resize-none bg-transparent border-0 text-body text-ink-primary placeholder:text-ink-muted focus:outline-none px-1 py-2 max-h-32"
              />
              <button
                onClick={() => send(draft)}
                disabled={!draft.trim()}
                className="h-9 w-9 grid place-items-center rounded-md bg-gradient-to-br from-brand-500 to-accent-500 text-ink-invert hover:from-brand-600 hover:to-accent-700 transition-colors disabled:opacity-40 disabled:hover:from-brand-500 disabled:hover:to-accent-500 shrink-0"
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
              </button>
            </div>

            {/* Suggested prompts */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-caption uppercase tracking-[0.1em] text-ink-muted mr-1 self-center">
                Try
              </span>
              {SUGGESTED_PROMPTS.slice(0, 4).map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-body-sm text-ink-secondary hover:text-ink-primary px-2.5 py-1 rounded-full bg-subtle/60 hover:bg-subtle border border-border-soft transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-ink-muted text-center">
              Copilot grounds answers in your live TMS &amp; telematics. Decisions still require human approval — every action is audit logged.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Capability({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-ink-muted">
      <span className="text-accent-700">{icon}</span>
      {label}
    </div>
  );
}
