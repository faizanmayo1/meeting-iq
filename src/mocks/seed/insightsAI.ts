/** AI Insights page seed — capabilities + meeting-improvement opportunities + decision log. */

export type Capability = {
  key:
    | "extraction"
    | "fourE"
    | "premeet"
    | "alignment"
    | "memory"
    | "coach";
  title: string;
  blurb: string;
  metric: string;
  metricLabel: string;
  accuracy: number;
  trend: number[];
  status: "live" | "calibrating";
};

export const CAPABILITIES: Capability[] = [
  {
    key: "extraction",
    title: "Action & decision extraction",
    blurb: "Speaker-attributed transcripts → structured tasks with owners, deadlines, dependencies.",
    metric: "96%",
    metricLabel: "avg confidence · 2,000 actions",
    accuracy: 96,
    trend: [86, 88, 91, 93, 94, 95, 96],
    status: "live",
  },
  {
    key: "fourE",
    title: "4E meeting effectiveness",
    blurb: "Engagement, Effectiveness, Execution, Efficiency — scored per meeting and tracked over time.",
    metric: "76",
    metricLabel: "company avg · ↓ 2.4 this week",
    accuracy: 91,
    trend: [80, 79, 78, 77, 76, 76, 76],
    status: "live",
  },
  {
    key: "premeet",
    title: "Pre-meeting impact scoring",
    blurb: "Predicts meeting outcomes from the agenda before the invite is even sent.",
    metric: "84%",
    metricLabel: "agenda issues caught early",
    accuracy: 88,
    trend: [70, 74, 77, 80, 82, 83, 84],
    status: "live",
  },
  {
    key: "alignment",
    title: "Cross-team alignment detection",
    blurb: "Reads the decision graph to flag conflicts before they reach a launch.",
    metric: "1",
    metricLabel: "active conflict · $1.2M at stake",
    accuracy: 87,
    trend: [0, 1, 0, 0, 1, 1, 1],
    status: "live",
  },
  {
    key: "memory",
    title: "Knowledge memory",
    blurb: "Permission-aware semantic search across meetings, decisions, and outcomes.",
    metric: "2.1s",
    metricLabel: "avg time-to-cited-answer",
    accuracy: 93,
    trend: [4.2, 3.8, 3.4, 3.0, 2.6, 2.3, 2.1],
    status: "live",
  },
  {
    key: "coach",
    title: "AI meeting coach",
    blurb: "Pre, during, and post-meeting prompts — tailored to role and meeting type.",
    metric: "+18 pts",
    metricLabel: "avg 4E lift after coaching",
    accuracy: 82,
    trend: [4, 7, 10, 13, 15, 17, 18],
    status: "calibrating",
  },
];

export type MeetingFix = {
  id: string;
  meeting: string;
  pattern: string;
  fix: string;
  impactPts: number;
  saveDollars?: number;
  confidence: number;
  status: "review" | "approved" | "running";
};

export const MEETING_FIXES: MeetingFix[] = [
  {
    id: "f-1",
    meeting: "Q3 Steering · weekly",
    pattern: "Speaker imbalance · Sales VP 41%",
    fix: "Add 3-min round-robin · move 2 status updates async",
    impactPts: 12,
    confidence: 91,
    status: "review",
  },
  {
    id: "f-2",
    meeting: "Q3 Rollout Cross-Team Prep · tomorrow",
    pattern: "Pre-meeting score 42 · missing decision owners",
    fix: "Assign owners · add InfoSec stakeholder · pre-read",
    impactPts: 36,
    confidence: 88,
    status: "review",
  },
  {
    id: "f-3",
    meeting: "Engineering Retro · weekly",
    pattern: "Status-only agenda · 3 wks low engagement",
    fix: "Convert to async · pre-drafted template",
    impactPts: 22,
    saveDollars: 4500,
    confidence: 84,
    status: "approved",
  },
  {
    id: "f-4",
    meeting: "Pipeline Review · weekly",
    pattern: "Decisions compressed in last 6 min",
    fix: "Dedicated 15-min decision block · agenda v2",
    impactPts: 14,
    confidence: 79,
    status: "running",
  },
  {
    id: "f-5",
    meeting: "Product Strategy · biweekly",
    pattern: "Ownership clarity 71% · 3 actions w/o owner",
    fix: "Enforce decision-owner template · auto-prompt at meeting end",
    impactPts: 18,
    confidence: 86,
    status: "review",
  },
];

export type DemandRow = {
  week: string;
  Engagement: number;
  Effectiveness: number;
  Execution: number;
  Efficiency: number;
};

export const FOUR_E_TREND: DemandRow[] = Array.from({ length: 12 }, (_, i) => {
  const x = i / 11;
  const wave = Math.sin(i * 1.4) * 2;
  return {
    week: `W${i + 1}`,
    Engagement: 78 + 4 * x + wave,
    Effectiveness: 76 + 5 * x + wave * 0.6,
    Execution: 70 + 8 * x + wave * 0.8,
    Efficiency: 80 + 2 * x + wave * 0.4,
  };
});

export type AIDecision = {
  id: string;
  time: string;
  action: string;
  detail: string;
  outcome: "auto" | "human" | "rejected";
  saved?: string;
};

export const AI_DECISIONS: AIDecision[] = [
  { id: "d-1", time: "9:24 am", action: "Extracted Q3 Steering outcomes",   detail: "1 decision · 4 actions · 2 risks", outcome: "auto",  saved: "+1.4 hr saved" },
  { id: "d-2", time: "9:18 am", action: "Synced 4 actions to Jira / Asana", detail: "JIRA · ENT-241, INF-902 + 2 Asana", outcome: "auto" },
  { id: "d-3", time: "9:11 am", action: "Flagged Product/Sales conflict",   detail: "Cross-meeting · escalated to leadership", outcome: "human", saved: "+$1.2M protected" },
  { id: "d-4", time: "8:54 am", action: "Posted summary to Slack",          detail: "Leadership Weekly → #leadership", outcome: "auto" },
  { id: "d-5", time: "8:40 am", action: "Pre-meeting agenda score",         detail: "Stefan ↔ Priya 1:1 · 84 (no fixes needed)", outcome: "human" },
  { id: "d-6", time: "8:18 am", action: "Escalated overdue pricing action", detail: "Auto-added to Marketing manager 1:1", outcome: "auto" },
];
