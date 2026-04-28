import type { Department } from "./users";

export type RiskSeverity = "critical" | "warning" | "info";
export type RiskKind =
  | "alignment_conflict"
  | "ownership_unclear"
  | "decision_overdue"
  | "engagement_drop"
  | "blocker"
  | "deadline_slip"
  | "meeting_overload";
export type RiskState = "open" | "in_progress" | "auto_resolved" | "resolved";

export type Risk = {
  id: string;
  severity: RiskSeverity;
  kind: RiskKind;
  state: RiskState;
  title: string;
  detail: string;
  owner?: string;            // user id
  meetingId?: string;
  decisionId?: string;
  departments: Department[];
  age: string;
  ageMinutes: number;
  dollarImpact?: number;
  resolution: string;
  resolutions?: Array<{
    id: string;
    label: string;
    description: string;
    recommended?: boolean;
    destructive?: boolean;
  }>;
};

export const RISKS: Risk[] = [
  {
    id: "r-priority-conflict",
    severity: "critical",
    kind: "alignment_conflict",
    state: "open",
    title: "Product / Sales priority conflict on Q3 rollout",
    detail:
      "Sales committed Halcyon and 4 wave-two accounts to a single Aug 14 launch in pricing negotiations. Product's phased plan (decided today in the Q3 Steering) splits those accounts across waves. Conflict surfaced in two separate meetings.",
    owner: "u-stefan",
    meetingId: "m-q3-roll-w11",
    decisionId: "d-rollout-phased",
    departments: ["Sales", "Product"],
    age: "8m",
    ageMinutes: 8,
    dollarImpact: 1_200_000,
    resolution: "Cross-functional alignment meeting",
    resolutions: [
      {
        id: "schedule-align",
        label: "Schedule cross-functional alignment meeting",
        description:
          "Auto-schedule a 30-min decision-only session with Product, Sales, Engineering, CS owners. AI drafts the agenda with the conflict and 3 resolution options.",
        recommended: true,
      },
      {
        id: "exec-call",
        label: "Escalate to CEO (Priya Iyer)",
        description: "Add to Stefan ↔ Priya 1:1 tomorrow as a decision item.",
      },
      {
        id: "snooze",
        label: "Snooze 24h",
        description: "Risk surfaces again at next Q3 Steering. Margin exposure climbs $48K/day.",
      },
    ],
  },
  {
    id: "r-ownership-rollout",
    severity: "warning",
    kind: "ownership_unclear",
    state: "open",
    title: "Q3 rollout · 2 actions without clear owner",
    detail:
      "InfoSec sign-off and the wave-two on-call rotation are referenced but not assigned. AI suggests Talia (Eng) for on-call; InfoSec needs a stakeholder added to next meeting.",
    owner: "u-talia",
    meetingId: "m-q3-roll-w11",
    departments: ["Engineering", "Operations"],
    age: "12m",
    ageMinutes: 12,
    resolution: "Assign owners · 2 actions",
    resolutions: [
      {
        id: "assign-now",
        label: "Auto-assign suggested owners",
        description: "Talia for on-call, InfoSec lead for sign-off. AI sends Slack confirmation.",
        recommended: true,
      },
      {
        id: "review",
        label: "Review with Stefan",
        description: "Send to chief-of-staff for human review before assigning.",
      },
    ],
  },
  {
    id: "r-engagement-drop",
    severity: "warning",
    kind: "engagement_drop",
    state: "open",
    title: "Q3 Steering · engagement down 8 pts week-over-week",
    detail:
      "Engagement score on the recurring Q3 Steering meeting dropped from 86 to 78. Speaker balance skewed: Sales VP spoke 41% of the time. Three attendees did not speak.",
    meetingId: "m-q3-roll-w11",
    departments: ["Leadership"],
    age: "23m",
    ageMinutes: 23,
    resolution: "AI agenda restructure",
    resolutions: [
      {
        id: "restructure",
        label: "Apply AI agenda restructure",
        description:
          "Convert 2 status updates to async, add explicit decision points, set 3-min round-robin for cross-team input. Pushes the next meeting score to projected 88.",
        recommended: true,
      },
      {
        id: "split",
        label: "Split into 2 shorter meetings",
        description: "Decision meeting (30 min) + working session (45 min).",
      },
      {
        id: "ignore",
        label: "Mark as one-off",
        description: "Likely caused by today's specific conflict — re-evaluate next week.",
      },
    ],
  },
  {
    id: "r-decision-overdue",
    severity: "warning",
    kind: "decision_overdue",
    state: "open",
    title: "Tier-3 SLA decision · 3 days overdue",
    detail:
      "Decision raised in CS QBR Prep is past its scheduled close. Holds up CS resource allocation for the rollout.",
    owner: "u-maya",
    meetingId: "m-cs-qbr",
    decisionId: "d-tier3-sla",
    departments: ["Customer Success", "Sales"],
    age: "3d",
    ageMinutes: 4320,
    resolution: "Auto-route to next CS leadership meeting",
  },
  {
    id: "r-overload-product",
    severity: "warning",
    kind: "meeting_overload",
    state: "open",
    title: "Product team · 40% more meeting time, fewer completed actions",
    detail:
      "Across the last 4 weeks, Product spent 40% more time in meetings than the company average but completed 22% fewer assigned actions. Two recurring meetings are candidates for consolidation.",
    departments: ["Product"],
    age: "1h 14m",
    ageMinutes: 74,
    resolution: "Consolidate 2 recurring meetings",
  },
  {
    id: "r-blocker-auth",
    severity: "critical",
    kind: "blocker",
    state: "in_progress",
    title: "Auth provider migration blocked on InfoSec sign-off",
    detail:
      "Wave-1 launch on Aug 14 requires the new auth provider live by Aug 9. InfoSec review has been pending for 6 days.",
    owner: "u-ravi",
    decisionId: "d-auth-migration",
    departments: ["Engineering", "Operations"],
    age: "6d",
    ageMinutes: 8640,
    dollarImpact: 800_000,
    resolution: "Escalate to CTO · expedite review",
  },
  {
    id: "r-pricing-overdue",
    severity: "warning",
    kind: "deadline_slip",
    state: "open",
    title: "Pricing page update · overdue by 0d",
    detail:
      "Action assigned to Marketing 7 days ago, due today. Sales reps need updated tiers for the Q3 motion.",
    owner: "u-elena",
    departments: ["Marketing", "Sales"],
    age: "7d",
    ageMinutes: 10080,
    resolution: "Re-assign to Mgr · same team",
  },
  {
    id: "r-mercer-data-room",
    severity: "warning",
    kind: "deadline_slip",
    state: "in_progress",
    title: "Mercer data-room access · overdue 1d",
    detail:
      "Critical for procurement review. Auto-escalated to Operations Director.",
    owner: "u-grace",
    departments: ["Operations"],
    age: "1d",
    ageMinutes: 1440,
    resolution: "Auto-escalated · ETA 4h",
  },
  {
    id: "r-low-prep-rollout",
    severity: "warning",
    kind: "engagement_drop",
    state: "open",
    title: "Q3 Rollout Cross-Team Prep · pre-meeting score 42",
    detail:
      "Tomorrow's prep meeting agenda lacks decision owners and is missing the InfoSec stakeholder. AI projects the meeting will produce ≤ 1 actionable outcome.",
    meetingId: "m-rollout-prep",
    departments: ["Product", "Sales", "Engineering", "Customer Success"],
    age: "47m",
    ageMinutes: 47,
    resolution: "Apply AI agenda fixes before invite",
  },
  {
    id: "r-weather-i10",
    severity: "info",
    kind: "engagement_drop",
    state: "auto_resolved",
    title: "Engineering retro · low engagement (auto-resolved)",
    detail:
      "Engagement score dipped to 64 last Monday. Pattern matched the 'agenda heavy on status' template. Async-conversion suggestion sent to Talia and accepted.",
    meetingId: "m-eng-retro-w10",
    departments: ["Engineering"],
    age: "2d",
    ageMinutes: 2880,
    resolution: "Auto-cleared after async migration",
  },
];

export const RISK_PREVIEW = RISKS.filter(
  (r) => r.state === "open" || r.state === "in_progress"
).slice(0, 3);
