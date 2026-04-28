import { Bot, User, X, ArrowRight } from "lucide-react";
import type { AIDecision } from "@/mocks/seed/ai";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const OUTCOME = {
  auto: { tone: "accent" as const, label: "Auto", Icon: Bot },
  human: { tone: "info" as const, label: "Human approved", Icon: User },
  rejected: { tone: "neutral" as const, label: "Rejected", Icon: X },
};

export function AIDecisionLog({ decisions }: { decisions: AIDecision[] }) {
  return (
    <ol className="relative">
      <span className="absolute left-[15px] top-2 bottom-2 w-px bg-border-soft" />
      {decisions.map((d) => {
        const o = OUTCOME[d.outcome];
        return (
          <li key={d.id} className="relative pl-10 pb-4 last:pb-0">
            <span
              className={cn(
                "absolute left-1 top-0 h-5 w-5 rounded-full ring-4 ring-surface grid place-items-center",
                d.outcome === "auto"
                  ? "bg-accent-50 text-accent-700"
                  : d.outcome === "human"
                  ? "bg-brand-50 text-brand-700"
                  : "bg-subtle text-ink-muted"
              )}
            >
              <o.Icon className="h-3 w-3" strokeWidth={2.25} />
            </span>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-body-sm font-medium text-ink-primary leading-snug pr-2">
                {d.action}
              </p>
              <span className="text-[11px] font-mono tabular-nums text-ink-muted shrink-0">
                {d.time}
              </span>
            </div>
            <p className="text-[12px] text-ink-muted leading-snug mt-0.5">{d.detail}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Badge tone={o.tone} size="sm" dot>
                {o.label}
              </Badge>
              {d.saved && (
                <span className="text-[11px] text-success-700 font-medium tabular-nums">
                  {d.saved}
                </span>
              )}
            </div>
          </li>
        );
      })}
      <li className="relative pl-10">
        <button className="text-body-sm font-medium text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
          View full audit log
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </li>
    </ol>
  );
}
