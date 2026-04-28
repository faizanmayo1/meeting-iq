import { Bot, CircleAlert, Settings, ZapOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Workflow } from "@/mocks/seed/workflows";
import { cn } from "@/lib/utils";

const MODE: Record<
  Workflow["mode"],
  { label: string; tone: "accent" | "info" | "warning" | "neutral"; Icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }> }
> = {
  auto: { label: "Auto", tone: "accent", Icon: Bot },
  human_approval: { label: "Human approval", tone: "info", Icon: CircleAlert },
  calibrating: { label: "Calibrating", tone: "warning", Icon: Settings },
  off: { label: "Disabled", tone: "neutral", Icon: ZapOff },
};

export function WorkflowCard({ wf }: { wf: Workflow }) {
  const m = MODE[wf.mode];
  const isOff = wf.mode === "off" || !wf.enabled;
  return (
    <div
      className={cn(
        "group rounded-xl bg-surface border border-border-soft shadow-elev-1 p-4 transition-all hover:border-border",
        isOff && "opacity-70"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <span
            className={cn(
              "h-8 w-8 shrink-0 rounded-md grid place-items-center",
              wf.mode === "auto"
                ? "bg-accent-50 text-accent-700"
                : wf.mode === "human_approval"
                ? "bg-brand-50 text-brand-700"
                : wf.mode === "calibrating"
                ? "bg-warning-50 text-warning-700"
                : "bg-subtle text-ink-muted"
            )}
          >
            <m.Icon className="h-4 w-4" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h3 className="text-body font-medium text-ink-primary leading-tight truncate">{wf.name}</h3>
            <Badge tone={m.tone} size="sm" className="mt-1">
              {m.label}
            </Badge>
          </div>
        </div>
        <Toggle on={wf.enabled} />
      </div>

      <div className="mt-3 space-y-1.5">
        <Row label="When" value={wf.trigger} />
        <Row label="Then" value={wf.action} />
      </div>

      <div className="mt-3 pt-3 border-t border-border-soft grid grid-cols-3 gap-2 text-[12px]">
        <Stat label="Runs" value={wf.runsToday.toString()} />
        <Stat
          label="Success"
          value={`${wf.successPct.toFixed(1)}%`}
          tone={wf.successPct >= 95 ? "success" : wf.successPct >= 85 ? "neutral" : "warning"}
        />
        <Stat label="Last" value={wf.lastRun} />
      </div>

      {wf.saved && (
        <p className="mt-2.5 text-[11px] font-medium text-success-700 tabular-nums">{wf.saved}</p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 text-body-sm">
      <span className="text-[10px] uppercase tracking-[0.1em] text-ink-muted shrink-0 w-10">{label}</span>
      <span className="text-ink-secondary leading-snug">{value}</span>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "success" | "warning" | "neutral" }) {
  return (
    <div className="rounded-md bg-subtle/60 px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-[0.08em] text-ink-muted">{label}</p>
      <p
        className={cn(
          "text-body-sm font-medium tabular-nums leading-tight mt-0.5",
          tone === "success" && "text-success-700",
          tone === "warning" && "text-warning-700",
          (!tone || tone === "neutral") && "text-ink-primary"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      role="switch"
      aria-checked={on}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors",
        on ? "bg-brand-500" : "bg-border-strong"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </span>
  );
}
