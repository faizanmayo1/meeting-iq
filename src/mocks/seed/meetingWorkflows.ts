export type WorkflowMode = "auto" | "human_approval" | "calibrating" | "off";

export type Workflow = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  mode: WorkflowMode;
  enabled: boolean;
  runsToday: number;
  successPct: number;
  lastRun: string;
  saved?: string;
};

export const WORKFLOWS: Workflow[] = [
  {
    id: "wf-extract",
    name: "Auto-extract decisions & actions",
    trigger: "Meeting transcript completes",
    action: "Run extraction model · attach to source meeting",
    mode: "auto",
    enabled: true,
    runsToday: 38,
    successPct: 96.4,
    lastRun: "2m ago",
    saved: "1.4 hr / dispatcher saved",
  },
  {
    id: "wf-task-sync",
    name: "Sync action items to task systems",
    trigger: "Action confidence ≥ 85%",
    action: "Create Jira / Asana / Linear ticket · assign owner",
    mode: "auto",
    enabled: true,
    runsToday: 22,
    successPct: 99.1,
    lastRun: "now",
    saved: "$1,950 / wk in admin time",
  },
  {
    id: "wf-low-conf",
    name: "Low-confidence extraction review",
    trigger: "Extraction confidence < 85%",
    action: "Send to approval inbox for human review",
    mode: "human_approval",
    enabled: true,
    runsToday: 6,
    successPct: 100,
    lastRun: "14m ago",
  },
  {
    id: "wf-conflict",
    name: "Cross-meeting conflict detection",
    trigger: "Conflicting decision detected across meetings",
    action: "Open alignment risk · suggest cross-functional meeting",
    mode: "human_approval",
    enabled: true,
    runsToday: 1,
    successPct: 92.0,
    lastRun: "1h ago",
    saved: "+$1.2M protected",
  },
  {
    id: "wf-summary",
    name: "Post-meeting summary to Slack",
    trigger: "Meeting completes",
    action: "Post AI summary to #ops-room · @mention owners",
    mode: "auto",
    enabled: true,
    runsToday: 14,
    successPct: 100,
    lastRun: "3m ago",
  },
  {
    id: "wf-overdue",
    name: "Overdue action escalation",
    trigger: "Action overdue > 24h",
    action: "Notify owner + manager · auto-add to next 1:1 agenda",
    mode: "auto",
    enabled: true,
    runsToday: 4,
    successPct: 95.0,
    lastRun: "12m ago",
  },
  {
    id: "wf-prep",
    name: "Pre-meeting agenda coach",
    trigger: "Meeting created · 24h before start",
    action: "Score agenda · recommend stakeholders + decision points",
    mode: "calibrating",
    enabled: true,
    runsToday: 9,
    successPct: 84.0,
    lastRun: "now",
  },
  {
    id: "wf-coach-digest",
    name: "Manager coaching digest",
    trigger: "Weekly · Friday 16:00",
    action: "Email manager + IC · 4E trends + suggested fixes",
    mode: "auto",
    enabled: true,
    runsToday: 0,
    successPct: 100,
    lastRun: "Yesterday",
  },
  {
    id: "wf-async",
    name: "Auto-convert status meetings to async",
    trigger: "Pattern: status-only · low engagement 3+ weeks",
    action: "Suggest async migration · pre-draft template",
    mode: "off",
    enabled: false,
    runsToday: 0,
    successPct: 78.0,
    lastRun: "Disabled",
  },
];

export type ApprovalItem = {
  id: string;
  workflow: string;
  title: string;
  detail: string;
  meetingRef?: string;
  ownerHint?: string;
  impact: string;
  saving?: string;
  age: string;
  severity: "critical" | "warning" | "info";
};

export const APPROVAL_INBOX: ApprovalItem[] = [
  {
    id: "ap-1",
    workflow: "wf-conflict",
    title: "Schedule cross-functional alignment for Q3 rollout",
    detail:
      "Phased plan vs single-launch commit detected across two meetings. AI recommends a 30-min decision-only session.",
    meetingRef: "Q3 Steering · Today",
    ownerHint: "Stefan Trifan",
    impact: "Resolves $1.2M revenue conflict",
    saving: "+$1.2M",
    age: "8m",
    severity: "critical",
  },
  {
    id: "ap-2",
    workflow: "wf-low-conf",
    title: "Review 3 low-confidence action extractions",
    detail:
      "3 actions extracted at 71–79% confidence. Two missing owners, one missing due date. Suggested fixes ready.",
    meetingRef: "Q3 Steering · Marketing Launch",
    impact: "3 actions to confirm",
    age: "12m",
    severity: "warning",
  },
  {
    id: "ap-3",
    workflow: "wf-prep",
    title: "Apply 3 agenda fixes to tomorrow's Q3 Rollout Prep",
    detail:
      "Pre-meeting score 42 → projected 78. Add InfoSec stakeholder, assign decision owners, swap 15-min status for async pre-read.",
    meetingRef: "Q3 Rollout Prep · Tomorrow 10:00",
    ownerHint: "Amelia Park",
    impact: "Pre-meeting score 42 → 78",
    saving: "+36 pts",
    age: "47m",
    severity: "warning",
  },
  {
    id: "ap-4",
    workflow: "wf-async",
    title: "Convert Engineering Retro to async",
    detail:
      "Pattern detected — status-only agenda + 3 weeks of low engagement. Pre-drafted async template ready to send.",
    meetingRef: "Engineering Retro · weekly",
    ownerHint: "Talia Brooks",
    impact: "~30 min/wk reclaimed × 9 attendees",
    saving: "4.5 hr/wk",
    age: "2h",
    severity: "info",
  },
];

export type RunRow = {
  id: string;
  time: string;
  workflow: string;
  outcome: "auto" | "approved" | "rejected" | "snoozed";
  detail: string;
  saved?: string;
};

export const RUN_HISTORY: RunRow[] = [
  { id: "r-1", time: "9:24 am", workflow: "Auto-extract decisions & actions", outcome: "auto",     detail: "Q3 Steering · 1 decision · 4 actions · 2 risks", saved: "+1.4 hr saved" },
  { id: "r-2", time: "9:18 am", workflow: "Sync action items to task systems", outcome: "auto",    detail: "4 tickets created across Jira / Asana", },
  { id: "r-3", time: "9:11 am", workflow: "Cross-meeting conflict detection", outcome: "approved", detail: "Phased plan vs Sales commit · alignment scheduled", saved: "+$1.2M protected" },
  { id: "r-4", time: "8:54 am", workflow: "Post-meeting summary to Slack",    outcome: "auto",     detail: "Leadership Weekly summary → #leadership" },
  { id: "r-5", time: "8:40 am", workflow: "Pre-meeting agenda coach",         outcome: "approved", detail: "Stefan ↔ Priya 1:1 · score 84 (no changes needed)" },
  { id: "r-6", time: "8:18 am", workflow: "Overdue action escalation",        outcome: "auto",     detail: "Pricing-page action escalated to Marketing manager" },
  { id: "r-7", time: "7:54 am", workflow: "Auto-convert status meetings",     outcome: "rejected", detail: "Sales Pipeline Review pattern not strong enough", },
  { id: "r-8", time: "7:40 am", workflow: "Low-confidence extraction review", outcome: "snoozed",  detail: "3 actions held for human review · 79% confidence" },
];
