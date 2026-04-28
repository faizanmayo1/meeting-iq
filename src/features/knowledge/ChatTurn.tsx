import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Copy,
  ArrowRight,
  CheckCircle2,
  ListChecks,
  ShieldAlert,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import type { ChatTurn, Citation, KnowledgeBlock } from "@/mocks/seed/knowledge";
import { DECISIONS } from "@/mocks/seed/decisions";
import { ACTIONS } from "@/mocks/seed/actions";
import { RISKS } from "@/mocks/seed/risks";
import { meetingById } from "@/mocks/seed/meetings";
import { userById } from "@/mocks/seed/users";
import { StatusBadge } from "@/components/data-display/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-ink-primary">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

const CITATION_ICON: Record<Citation["kind"], React.ComponentType<{ className?: string }>> = {
  meeting: CalendarDays,
  decision: CheckCircle2,
  action: ListChecks,
  risk: ShieldAlert,
};

const CITATION_TONE: Record<Citation["kind"], string> = {
  meeting: "text-brand-700 bg-brand-50 ring-brand-500/15",
  decision: "text-success-700 bg-success-50 ring-success-500/15",
  action: "text-accent-700 bg-accent-50 ring-accent-500/15",
  risk: "text-warning-700 bg-warning-50 ring-warning-500/15",
};

export function ChatTurnView({
  turn,
  onSuggest,
}: {
  turn: ChatTurn;
  onSuggest?: (s: string) => void;
}) {
  if (turn.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] rounded-2xl rounded-br-sm bg-ink-primary text-ink-invert px-4 py-2.5 text-body shadow-elev-1">
          {turn.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 max-w-[88%]">
      <div className="h-8 w-8 shrink-0 rounded-md bg-gradient-to-br from-brand-500 to-accent-500 grid place-items-center text-ink-invert shadow-elev-1">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2.25} />
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        <div className="ai-edge rounded-2xl rounded-tl-sm bg-surface p-4 shadow-elev-1">
          <p className="text-body text-ink-secondary leading-relaxed">{renderInline(turn.text)}</p>

          {turn.citations && turn.citations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border-soft">
              <p className="text-[10px] uppercase tracking-[0.12em] text-ink-muted font-semibold mb-1.5">
                Grounded in {turn.citations.length} source
                {turn.citations.length === 1 ? "" : "s"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {turn.citations.map((c, i) => {
                  const Icon = CITATION_ICON[c.kind];
                  return (
                    <button
                      key={`${c.kind}-${c.id}-${i}`}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium ring-1 ring-inset transition-colors hover:opacity-80",
                        CITATION_TONE[c.kind]
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      <span className="truncate max-w-[180px]">{c.label}</span>
                      {c.meta && (
                        <span className="text-[10px] opacity-70 normal-case font-normal">
                          · {c.meta}
                        </span>
                      )}
                      <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {turn.block && <BlockRenderer block={turn.block} />}

        {/* Action footer */}
        <div className="flex items-center gap-2">
          <button className="h-7 w-7 grid place-items-center rounded-md text-ink-muted hover:bg-subtle hover:text-ink-primary transition-colors">
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button className="h-7 w-7 grid place-items-center rounded-md text-ink-muted hover:bg-subtle hover:text-ink-primary transition-colors">
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
          <button className="h-7 px-2 rounded-md inline-flex items-center gap-1 text-[11px] text-ink-muted hover:bg-subtle hover:text-ink-primary transition-colors">
            <Copy className="h-3 w-3" /> Copy
          </button>
          <span className="text-[11px] text-ink-muted">· generated 2s ago · 0.9s</span>
        </div>

        {turn.followups && turn.followups.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {turn.followups.map((f) => (
              <button
                key={f}
                onClick={() => onSuggest?.(f)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-body-sm bg-accent-50/60 text-accent-700 border border-accent-500/20 hover:bg-accent-50 transition-colors"
              >
                <ArrowRight className="h-3 w-3" />
                {f}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BlockRenderer({ block }: { block: KnowledgeBlock }) {
  if (block.kind === "decision-card") {
    const d = DECISIONS.find((x) => x.id === block.decisionId);
    if (!d) return null;
    const meeting = meetingById(d.meetingId);
    return (
      <div className="rounded-xl border border-border-soft bg-surface p-4">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Badge tone="success" size="sm" dot>
            <CheckCircle2 className="h-3 w-3" /> Decision
          </Badge>
          <StatusBadge status={d.status} />
        </div>
        <h4 className="text-body font-medium text-ink-primary leading-snug">{d.title}</h4>
        <p className="text-body-sm text-ink-muted mt-1 leading-relaxed">{d.description}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-border-soft text-[11px]">
          <Stat
            label="Owner"
            value={
              <span className="inline-flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[8px] font-semibold">
                  {userById(d.owner)?.initials}
                </span>
                {userById(d.owner)?.name.split(" ")[0]}
              </span>
            }
          />
          <Stat label="Due" value={d.due ?? "—"} />
          <Stat label="Source" value={meeting?.title ?? "—"} />
          <Stat label="Departments" value={d.departments.join(" · ")} />
        </div>
      </div>
    );
  }

  if (block.kind === "action-list") {
    const items = block.actionIds.map((id) => ACTIONS.find((a) => a.id === id)!).filter(Boolean);
    if (items.length === 0) return null;
    return (
      <div className="rounded-xl border border-border-soft bg-surface p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge tone="info" size="sm" dot>
            <ListChecks className="h-3 w-3" /> Action items
          </Badge>
          <span className="text-[11px] text-ink-muted">{items.length} extracted</span>
        </div>
        <ul className="divide-y divide-border-soft -mx-4">
          {items.map((a) => {
            const owner = userById(a.owner);
            return (
              <li key={a.id} className="px-4 py-2.5 flex items-start gap-3 hover:bg-subtle/40 transition-colors">
                <div className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[9px] font-semibold">
                  {owner?.initials ?? "??"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm text-ink-primary leading-snug">{a.title}</p>
                  <div className="mt-0.5 flex items-center gap-1.5 flex-wrap text-[11px]">
                    <StatusBadge status={a.status} />
                    <span className="text-ink-muted">
                      {owner?.name.split(" ")[0]} · {a.ownerDept}
                    </span>
                    <span className="text-ink-disabled">·</span>
                    <span className="font-mono tabular-nums text-ink-muted">{a.due}</span>
                    {a.syncedTo && a.syncedTo.length > 0 && (
                      <>
                        <span className="text-ink-disabled">·</span>
                        <span className="text-accent-700">{a.syncedTo[0]}</span>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (block.kind === "risk-card") {
    const r = RISKS.find((x) => x.id === block.riskId);
    if (!r) return null;
    return (
      <div className="rounded-xl border border-border-soft bg-surface p-4">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Badge tone={r.severity === "critical" ? "danger" : r.severity === "warning" ? "warning" : "info"} size="sm" dot>
            <ShieldAlert className="h-3 w-3" /> Risk · {r.severity}
          </Badge>
        </div>
        <h4 className="text-body font-medium text-ink-primary">{r.title}</h4>
        <p className="text-body-sm text-ink-muted mt-1 leading-relaxed">{r.detail}</p>
      </div>
    );
  }

  return null;
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.1em] text-ink-muted font-semibold">{label}</p>
      <div className="mt-0.5 text-body-sm text-ink-primary">{value}</div>
    </div>
  );
}
