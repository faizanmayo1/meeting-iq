import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { FourE } from "@/mocks/seed/meetings";
import { cn } from "@/lib/utils";

type Props = {
  current: FourE;
  previous?: FourE;
  height?: number;
  showLegend?: boolean;
};

const KEYS: Array<{ key: keyof FourE; label: string }> = [
  { key: "engagement",    label: "Engagement" },
  { key: "effectiveness", label: "Effectiveness" },
  { key: "execution",     label: "Execution" },
  { key: "efficiency",    label: "Efficiency" },
];

export function FourERadar({ current, previous, height = 240, showLegend = true }: Props) {
  const data = KEYS.map((k) => ({
    metric: k.label,
    current: current[k.key],
    previous: previous?.[k.key] ?? 0,
  }));

  return (
    <div className="space-y-2">
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} outerRadius="78%">
          <defs>
            <radialGradient id="four-e-fill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--brand-500))" stopOpacity={0.32} />
              <stop offset="100%" stopColor="hsl(var(--brand-500))" stopOpacity={0.08} />
            </radialGradient>
          </defs>
          <PolarGrid
            stroke="hsl(var(--border-soft))"
            strokeDasharray="3 4"
            radialLines={false}
          />
          <PolarAngleAxis
            dataKey="metric"
            tick={{
              fill: "hsl(var(--ink-secondary))",
              fontSize: 11,
              fontWeight: 500,
            }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          {previous && (
            <Radar
              dataKey="previous"
              stroke="hsl(var(--ink-muted))"
              strokeWidth={1}
              strokeDasharray="4 4"
              fill="hsl(var(--ink-muted))"
              fillOpacity={0.05}
              isAnimationActive={false}
            />
          )}
          <Radar
            dataKey="current"
            stroke="hsl(var(--brand-500))"
            strokeWidth={2}
            fill="url(#four-e-fill)"
            isAnimationActive={false}
          />
          <Tooltip
            cursor={{ stroke: "hsl(var(--border-strong))", strokeDasharray: "3 3" }}
            contentStyle={{
              background: "hsl(var(--surface))",
              border: "1px solid hsl(var(--border-soft))",
              borderRadius: 8,
              boxShadow: "0 8px 24px -8px rgba(15,23,42,0.12)",
              fontSize: 12,
              padding: "8px 10px",
              color: "hsl(var(--ink-primary))",
            }}
            formatter={(v: number, name: string) => [
              `${v}`,
              name === "current" ? "This week" : "Last week",
            ]}
            labelStyle={{
              color: "hsl(var(--ink-muted))",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: 4,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {showLegend && (
        <div className="flex items-center justify-center gap-4 text-[11px] text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            This week
          </span>
          {previous && (
            <span className="inline-flex items-center gap-1.5">
              <span
                className={cn(
                  "h-0.5 w-3 border-t border-dashed",
                  "border-ink-muted"
                )}
              />
              Last week
            </span>
          )}
        </div>
      )}
    </div>
  );
}
