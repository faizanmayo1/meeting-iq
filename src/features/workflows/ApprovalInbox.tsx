import { ArrowRight, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ApprovalItem } from "@/mocks/seed/workflows";
import { cn } from "@/lib/utils";

const SEV: Record<ApprovalItem["severity"], "danger" | "warning" | "info"> = {
  critical: "danger",
  warning: "warning",
  info: "info",
};

export function ApprovalInbox({ items }: { items: ApprovalItem[] }) {
  return (
    <ul className="divide-y divide-border-soft">
      {items.map((item) => (
        <li key={item.id} className="p-4 hover:bg-subtle/40 transition-colors group">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "h-9 w-9 shrink-0 rounded-md grid place-items-center bg-gradient-to-br from-brand-500/15 to-accent-500/20 text-accent-700"
              )}
            >
              <Sparkles className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge tone={SEV[item.severity]} dot size="sm">
                  {item.severity}
                </Badge>
                <span className="text-[11px] text-ink-muted">
                  {item.workflow.replace("wf-", "")}
                  <span className="mx-1.5">·</span>
                  {item.age} ago
                </span>
              </div>
              <h4 className="mt-1 text-body font-medium text-ink-primary leading-snug">
                {item.title}
              </h4>
              <p className="mt-0.5 text-body-sm text-ink-muted leading-relaxed">{item.detail}</p>
              <div className="mt-2 flex items-center gap-2 flex-wrap text-[12px]">
                {item.load && (
                  <span className="font-mono text-ink-secondary bg-subtle px-1.5 py-0.5 rounded">{item.load}</span>
                )}
                {item.unit && (
                  <span className="font-mono text-ink-secondary bg-subtle px-1.5 py-0.5 rounded">{item.unit}</span>
                )}
                <span className="inline-flex items-center gap-1 text-ink-secondary">
                  <ArrowRight className="h-3 w-3" />
                  {item.impact}
                </span>
                {item.saving && (
                  <span className="text-success-700 font-medium tabular-nums">{item.saving}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <Button variant="ai" size="sm">
                <Sparkles className="h-3.5 w-3.5" />
                Approve
              </Button>
              <button className="h-7 inline-flex items-center justify-center gap-1 px-2.5 rounded-md text-body-sm text-ink-muted hover:bg-subtle hover:text-ink-primary transition-colors">
                <X className="h-3 w-3" />
                Decline
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
