import { ArrowRight, Sparkles, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/data-display/Sparkline";
import type { Prediction, MaintSystem } from "@/mocks/seed/maintenance";
import { cn } from "@/lib/utils";

const SYSTEM_LABEL: Record<MaintSystem, string> = {
  engine: "Engine",
  brakes: "Brakes",
  tires: "Tires",
  transmission: "Transmission",
  electrical: "Electrical",
  cooling: "Cooling",
  after_treatment: "After-treatment",
  telemetry: "Telemetry",
};

const LEVEL_TONE = { high: "danger", medium: "warning", low: "info" } as const;
const LEVEL_LABEL = { high: "High", medium: "Medium", low: "Low" } as const;

export function PredictionsTable({
  rows,
  onSelect,
}: {
  rows: Prediction[];
  onSelect?: (p: Prediction) => void;
}) {
  return (
    <div className="overflow-hidden">
      <table className="w-full text-body">
        <thead className="border-b border-border-soft">
          <tr className="text-left text-caption uppercase text-ink-muted tracking-[0.08em]">
            <Th>Unit</Th>
            <Th>System</Th>
            <Th>Predicted issue</Th>
            <Th align="right">Probability</Th>
            <Th>Window</Th>
            <Th>Recommended</Th>
            <Th align="right">Avoid</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr
              key={p.id}
              onClick={() => onSelect?.(p)}
              className="border-b border-border-soft last:border-b-0 cursor-pointer hover:bg-subtle/50 transition-colors group"
            >
              <td className="px-5 py-3.5">
                <div className="font-mono text-[13px] text-ink-primary">{p.unit}</div>
                <div className="text-[11px] text-ink-muted mt-0.5 truncate max-w-[120px]">
                  {p.driver}
                </div>
              </td>
              <td className="px-3 py-3.5">
                <span className="text-body-sm font-medium text-ink-primary">
                  {SYSTEM_LABEL[p.system]}
                </span>
                <div className="text-[11px] text-ink-muted">{p.issue.split(" ").slice(0, 4).join(" ")}</div>
              </td>
              <td className="px-3 py-3.5 text-body-sm text-ink-secondary max-w-[200px]">
                <span className="truncate block">{p.issue}</span>
              </td>
              <td className="px-3 py-3.5">
                <div className="flex items-center justify-end gap-2">
                  <Sparkline data={p.trend} positive={false} width={48} height={18} />
                  <ProbabilityChip pct={p.probabilityPct} />
                </div>
              </td>
              <td className="px-3 py-3.5">
                <Badge tone={LEVEL_TONE[p.level]} dot size="sm">
                  {LEVEL_LABEL[p.level]} · {p.windowDays}
                </Badge>
              </td>
              <td className="px-3 py-3.5 text-body-sm text-ink-secondary">{p.recommendedAt}</td>
              <td className="px-3 py-3.5 text-right">
                {p.costAvoided > 0 ? (
                  <span className="font-medium text-success-700 tabular-nums text-body-sm">
                    ${p.costAvoided.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-body-sm text-ink-muted">—</span>
                )}
              </td>
              <td className="px-5 py-3.5">
                {p.level === "high" ? (
                  <span className="inline-flex items-center gap-1 text-body-sm font-medium text-accent-700 px-2 py-1 rounded-md bg-accent-50">
                    <Sparkles className="h-3.5 w-3.5" />
                    Schedule
                  </span>
                ) : p.windowMinDays === 0 ? (
                  <span className="inline-flex items-center gap-1 text-body-sm text-ink-secondary">
                    <Wrench className="h-3.5 w-3.5" /> In service
                  </span>
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-body-sm text-ink-muted">
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className={cn(
        "font-medium px-3 py-2.5 first:pl-5 last:pr-5",
        align === "right" && "text-right"
      )}
    >
      {children}
    </th>
  );
}

function ProbabilityChip({ pct }: { pct: number }) {
  const tone =
    pct >= 70 ? "text-danger-700 bg-danger-50" : pct >= 50 ? "text-warning-700 bg-warning-50" : "text-brand-700 bg-brand-50";
  return (
    <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-body-sm font-medium tabular-nums", tone)}>
      {pct}%
    </span>
  );
}
