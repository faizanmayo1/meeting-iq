import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Series = { key: string; label: string; color?: string };

type Props = {
  data: Array<Record<string, number | string>>;
  xKey: string;
  series: Series[];
  height?: number;
  formatY?: (v: number) => string;
  hideAxis?: boolean;
};

const DEFAULT_COLORS = [
  "hsl(var(--brand-500))",
  "hsl(var(--accent-500))",
  "hsl(var(--success-500))",
  "hsl(var(--warning-500))",
];

export function TrendChart({ data, xKey, series, height = 180, formatY, hideAxis }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <defs>
          {series.map((s, i) => {
            const c = s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
            return (
              <linearGradient id={`grad-${s.key}`} key={s.key} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} stopOpacity={0.18} />
                <stop offset="100%" stopColor={c} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid stroke="hsl(var(--border-soft))" strokeDasharray="3 4" vertical={false} />
        {!hideAxis && (
          <>
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--ink-muted))", fontSize: 11 }}
              dy={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--ink-muted))", fontSize: 11 }}
              tickFormatter={(v) => (formatY ? formatY(Number(v)) : String(v))}
              width={36}
            />
          </>
        )}
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
          labelStyle={{
            color: "hsl(var(--ink-muted))",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: 4,
          }}
          formatter={(v: number) => (formatY ? formatY(v) : v)}
        />
        {series.map((s, i) => {
          const c = s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          return (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={c}
              fill={`url(#grad-${s.key})`}
              strokeWidth={2}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}
