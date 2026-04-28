import type { Department } from "./users";

export type DeptVelocity = {
  department: Department;
  meetingsPerWeek: number;
  avgMeetingToTaskMin: number;          // minutes from meeting end → task created
  avgDecisionToCompletionDays: number;
  followThroughPct: number;             // % actions completed by due date
  overduePct: number;
  ownershipClarityPct: number;          // % actions with single clear owner
  fourEAvg: number;                     // avg meeting effectiveness 0–100
  trend: number[];                      // 12 weeks of follow-through %
  flag?: { tone: "danger" | "warning" | "success" | "accent"; label: string };
};

const t = (start: number, drift: number, jitter: number, n = 12) =>
  Array.from({ length: n }, (_, i) => {
    const x = i / (n - 1);
    const noise = (Math.sin(i * 1.7) + Math.cos(i * 2.3)) * jitter;
    return Math.max(0, Math.min(100, start + drift * x + noise));
  });

export const DEPT_VELOCITY: DeptVelocity[] = [
  {
    department: "Sales",
    meetingsPerWeek: 18,
    avgMeetingToTaskMin: 6,
    avgDecisionToCompletionDays: 4.2,
    followThroughPct: 86,
    overduePct: 8,
    ownershipClarityPct: 92,
    fourEAvg: 82,
    trend: t(76, 10, 1.2),
    flag: { tone: "success", label: "Top quartile" },
  },
  {
    department: "Customer Success",
    meetingsPerWeek: 14,
    avgMeetingToTaskMin: 8,
    avgDecisionToCompletionDays: 5.6,
    followThroughPct: 79,
    overduePct: 12,
    ownershipClarityPct: 88,
    fourEAvg: 78,
    trend: t(72, 7, 1.1),
  },
  {
    department: "Leadership",
    meetingsPerWeek: 9,
    avgMeetingToTaskMin: 4,
    avgDecisionToCompletionDays: 3.4,
    followThroughPct: 92,
    overduePct: 4,
    ownershipClarityPct: 96,
    fourEAvg: 86,
    trend: t(86, 6, 1.0),
    flag: { tone: "accent", label: "Highest decision velocity" },
  },
  {
    department: "Engineering",
    meetingsPerWeek: 12,
    avgMeetingToTaskMin: 9,
    avgDecisionToCompletionDays: 6.8,
    followThroughPct: 74,
    overduePct: 14,
    ownershipClarityPct: 82,
    fourEAvg: 71,
    trend: t(68, 6, 1.6),
  },
  {
    department: "Product",
    meetingsPerWeek: 22,
    avgMeetingToTaskMin: 14,
    avgDecisionToCompletionDays: 8.4,
    followThroughPct: 62,
    overduePct: 22,
    ownershipClarityPct: 71,
    fourEAvg: 68,
    trend: t(74, -10, 1.4),
    flag: { tone: "warning", label: "Meeting overload" },
  },
  {
    department: "Operations",
    meetingsPerWeek: 11,
    avgMeetingToTaskMin: 7,
    avgDecisionToCompletionDays: 4.8,
    followThroughPct: 80,
    overduePct: 9,
    ownershipClarityPct: 86,
    fourEAvg: 76,
    trend: t(74, 6, 0.9),
  },
  {
    department: "Marketing",
    meetingsPerWeek: 10,
    avgMeetingToTaskMin: 11,
    avgDecisionToCompletionDays: 7.2,
    followThroughPct: 68,
    overduePct: 18,
    ownershipClarityPct: 78,
    fourEAvg: 72,
    trend: t(72, -4, 1.3),
  },
  {
    department: "Finance",
    meetingsPerWeek: 7,
    avgMeetingToTaskMin: 5,
    avgDecisionToCompletionDays: 3.9,
    followThroughPct: 88,
    overduePct: 6,
    ownershipClarityPct: 94,
    fourEAvg: 82,
    trend: t(82, 6, 0.8),
  },
];

/** Velocity over the last 12 weeks for the dashboard's mini multiples. */
export type VelocityPoint = {
  week: string;
  followThrough: number;
  decisionVelocity: number;   // decisions per week, normalized
  fourE: number;
  overdue: number;
};

export const VELOCITY_12W: VelocityPoint[] = Array.from({ length: 12 }, (_, i) => {
  const w = i + 1;
  const x = i / 11;
  const wave = Math.sin(i * 1.3) * 2.4;
  return {
    week: `W${w}`,
    followThrough: 70 + 8 * x + wave,
    decisionVelocity: 28 + 12 * x + wave,
    fourE: 74 + 6 * x + wave * 0.6,
    overdue: 18 - 6 * x - wave * 0.4,
  };
});

export const FOUR_E_TREND = VELOCITY_12W.map((v) => ({
  week: v.week,
  Engagement: Math.round(v.fourE + 4),
  Effectiveness: Math.round(v.fourE),
  Execution: Math.round(v.fourE - 4),
  Efficiency: Math.round(v.fourE + 2),
}));
