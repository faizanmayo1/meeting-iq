import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { AlertTriangle, ArrowRight, Truck } from "lucide-react";
import type { HOSDriver, LaneRow } from "@/mocks/seed/copilot";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function LaneChartBlock({ data }: { data: LaneRow[] }) {
  return (
    <div className="rounded-lg border border-border-soft bg-surface p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">
          Avg delay (min) · last 30 days
        </p>
        <span className="text-[11px] text-ink-muted tabular-nums">{data.length} lanes</span>
      </div>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border-soft))" strokeDasharray="3 4" horizontal={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--ink-muted))", fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="lane"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--ink-secondary))", fontSize: 12, fontWeight: 500 }}
              width={86}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--brand-50))" }}
              contentStyle={{
                background: "hsl(var(--surface))",
                border: "1px solid hsl(var(--border-soft))",
                borderRadius: 8,
                boxShadow: "0 8px 24px -8px rgba(15,23,42,0.12)",
                fontSize: 12,
                padding: "8px 10px",
              }}
              formatter={(v: number) => [`${v} min`, "avg delay"]}
            />
            <Bar dataKey="avgDelay" radius={[4, 4, 4, 4]} barSize={14}>
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={i === 0 ? "hsl(var(--danger-500))" : i === 1 ? "hsl(var(--warning-500))" : "hsl(var(--brand-500))"}
                  fillOpacity={i === 0 ? 0.95 : i < 3 ? 0.85 : 0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 pt-3 border-t border-border-soft text-body-sm">
        <p className="text-ink-muted text-[11px] uppercase tracking-[0.1em] mb-1.5">Root cause</p>
        <ul className="space-y-1">
          {data.slice(0, 3).map((l, i) => (
            <li key={l.lane} className="flex items-baseline gap-2">
              <span className="font-mono text-[11px] text-ink-muted shrink-0 w-14">{l.lane}</span>
              <span className="text-ink-secondary flex-1">{l.cause}</span>
              <span
                className={cn(
                  "tabular-nums text-[11px] font-medium shrink-0",
                  i === 0 ? "text-danger-700" : i === 1 ? "text-warning-700" : "text-ink-muted"
                )}
              >
                +{l.avgDelay}m
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function HOSListBlock({ drivers }: { drivers: HOSDriver[] }) {
  return (
    <div className="space-y-2">
      {drivers.map((d) => (
        <div
          key={d.unit}
          className={cn(
            "rounded-lg border bg-surface p-3.5 flex items-center gap-3 transition-colors hover:bg-subtle/40",
            d.status === "critical" ? "border-danger-500/30 bg-danger-50/30" : "border-border-soft"
          )}
        >
          <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[11px] font-semibold">
            {d.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-body font-medium text-ink-primary">{d.name}</span>
              <span className="text-[11px] font-mono text-ink-muted">{d.unit}</span>
              <Badge tone={d.status === "critical" ? "danger" : "warning"} size="sm" dot>
                {d.status === "critical" ? "Critical" : "Warning"}
              </Badge>
            </div>
            <p className="text-[11px] text-ink-muted mt-0.5">
              On <span className="font-mono">{d.load}</span> · {d.status === "critical" ? "auto-suggest re-assign" : "monitoring"}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 text-body-sm font-medium tabular-nums text-ink-primary">
              <AlertTriangle
                className={cn(
                  "h-3.5 w-3.5",
                  d.status === "critical" ? "text-danger-500" : "text-warning-500"
                )}
                strokeWidth={2}
              />
              {d.hoursLeft}
            </div>
            <p className="text-[11px] text-ink-muted">until HOS</p>
          </div>
          <button className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-0.5 text-body-sm text-brand-600 hover:text-brand-700 transition-colors">
            <Truck className="h-3.5 w-3.5" />
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
