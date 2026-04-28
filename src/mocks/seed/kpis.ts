import type { KPI } from "@/components/data-display/KPICard";

const trend = (start: number, drift: number, jitter: number, n = 24) =>
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const noise = (Math.sin(i * 1.7) + Math.cos(i * 2.3)) * jitter;
    return start + drift * t + noise;
  });

/** 6 hero KPIs for the Executive Dashboard. */
export const KPIS: KPI[] = [
  {
    label: "Action completion",
    value: 78.4,
    format: "percent",
    delta: 3.6,
    trend: trend(72, 6, 0.6),
    annotation: "+3.6% — fastest dept: Sales · 86%",
  },
  {
    label: "Decision velocity",
    value: 4.2,
    format: "number",
    delta: -8.1,
    invertedDelta: true,
    trend: trend(5.4, -1.2, 0.18),
    annotation: "Days to close · 1.2 day improvement",
  },
  {
    label: "Avg meeting effectiveness",
    value: 76,
    format: "number",
    delta: -2.4,
    trend: trend(80, -4, 0.7),
    annotation: "4E avg · Q3 Steering down 8 pts",
  },
  {
    label: "Open risks",
    value: 9,
    format: "number",
    delta: 12.5,
    invertedDelta: true,
    trend: trend(6, 3, 0.6),
    annotation: "1 critical · alignment conflict on Q3 rollout",
  },
  {
    label: "Meeting volume",
    value: 142,
    format: "number",
    delta: -4.2,
    invertedDelta: true,
    trend: trend(154, -12, 2),
    annotation: "12 lower this week · async migration helping",
  },
  {
    label: "Execution score",
    value: 82.6,
    format: "percent",
    delta: 1.4,
    trend: trend(80, 3, 0.4),
    annotation: "Composite of follow-through + ownership clarity",
  },
];
