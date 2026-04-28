import { ArrowRight, Sparkles } from "lucide-react";
import type { MeetingFix } from "@/mocks/seed/insightsAI";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<MeetingFix["status"], "info" | "success" | "accent"> = {
  review: "info",
  approved: "success",
  running: "accent",
};
const STATUS_LABEL: Record<MeetingFix["status"], string> = {
  review: "Awaiting review",
  approved: "Approved",
  running: "Running",
};

export function MeetingFixesTable({ rows }: { rows: MeetingFix[] }) {
  return (
    <div className="overflow-hidden">
      <table className="w-full text-body">
        <thead className="border-b border-border-soft">
          <tr className="text-left text-caption uppercase text-ink-muted tracking-[0.08em]">
            <Th>Meeting</Th>
            <Th>Pattern → fix</Th>
            <Th align="right">Score lift</Th>
            <Th align="right">Confidence</Th>
            <Th>Status</Th>
            <Th align="right">Action</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-b border-border-soft last:border-b-0 hover:bg-subtle/40 transition-colors group cursor-pointer"
            >
              <td className="px-5 py-3.5">
                <p className="text-body-sm font-medium text-ink-primary">{r.meeting}</p>
              </td>
              <td className="px-3 py-3.5">
                <p className="text-body-sm text-ink-secondary leading-snug">{r.pattern}</p>
                <div className="flex items-center gap-1 text-body-sm text-accent-700 font-medium mt-0.5">
                  <ArrowRight className="h-3 w-3" />
                  {r.fix}
                </div>
              </td>
              <td className="px-3 py-3.5 text-right">
                <span className="font-mono text-body-sm tabular-nums font-medium text-success-700">
                  +{r.impactPts} pts
                </span>
                {r.saveDollars && (
                  <div className="text-[11px] text-ink-muted tabular-nums mt-0.5">
                    ${r.saveDollars.toLocaleString()} / wk
                  </div>
                )}
              </td>
              <td className="px-3 py-3.5 text-right">
                <ConfidenceBar value={r.confidence} />
              </td>
              <td className="px-3 py-3.5">
                <Badge tone={STATUS_TONE[r.status]} dot size="sm">
                  {STATUS_LABEL[r.status]}
                </Badge>
              </td>
              <td className="px-5 py-3.5 text-right">
                {r.status === "review" ? (
                  <span className="inline-flex items-center gap-1 text-body-sm font-medium text-accent-700 px-2 py-1 rounded-md bg-accent-50">
                    <Sparkles className="h-3.5 w-3.5" />
                    Approve
                  </span>
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-body-sm text-ink-muted">
                    Open
                    <ArrowRight className="h-3.5 w-3.5" />
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

function ConfidenceBar({ value }: { value: number }) {
  const tone = value >= 90 ? "bg-success-500" : value >= 80 ? "bg-brand-500" : "bg-warning-500";
  return (
    <div className="inline-flex items-center gap-2 justify-end">
      <div className="relative h-1.5 w-16 rounded-full bg-subtle overflow-hidden">
        <div className={cn("absolute inset-y-0 left-0 rounded-full", tone)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-body-sm font-medium tabular-nums text-ink-secondary">{value}%</span>
    </div>
  );
}
