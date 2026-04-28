import type { Department } from "./users";

export type MeetingStatus = "completed" | "in_progress" | "upcoming" | "cancelled";
export type MeetingImpact = "high" | "medium" | "low";

/** 4E score breakdown — each 0–100. */
export type FourE = {
  engagement: number;
  effectiveness: number;
  execution: number;
  efficiency: number;
};

export const fourEAvg = (s: FourE) =>
  Math.round((s.engagement + s.effectiveness + s.execution + s.efficiency) / 4);

export type TranscriptTurn = {
  id: string;
  ts: string;            // "00:14:22"
  speaker: string;       // user id
  text: string;
  extracted?: Array<{
    kind: "decision" | "action" | "risk";
    label: string;
    confidence: number;  // 0–1
    owner?: string;      // user id
    due?: string;
  }>;
};

export type Meeting = {
  id: string;
  title: string;
  series?: string;       // for recurring meetings
  status: MeetingStatus;
  startsAt: string;
  duration: string;      // "45 min"
  durationMin: number;
  organizer: string;     // user id
  attendees: string[];   // user ids
  attendeesCount?: number;
  departments: Department[];
  customer?: string;
  agendaItems?: number;
  decisionsCount: number;
  actionsCount: number;
  risksCount: number;
  fourE: FourE;
  fourEPrev?: FourE;
  impact: MeetingImpact;
  preMeetingScore?: number; // 0–100, predictive
  highlight?: string;       // 1-line AI summary
  flag?: { tone: "danger" | "warning" | "success" | "accent"; label: string };
  transcript?: TranscriptTurn[];
};

const heroTranscript: TranscriptTurn[] = [
  {
    id: "tr-1",
    ts: "00:02:14",
    speaker: "u-stefan",
    text:
      "Quick reset on where we are. We're three weeks from the Q3 enterprise rollout window and I want to leave today with a single phased plan everyone is signed up to.",
  },
  {
    id: "tr-2",
    ts: "00:04:38",
    speaker: "u-amelia",
    text:
      "Product's recommendation is three waves — Halcyon Health and Mercer & Pratt in wave one on August 14, the next four enterprise accounts in wave two on August 28, and the long-tail in mid-September.",
    extracted: [
      {
        kind: "decision",
        label: "Phase Q3 enterprise rollout in 3 waves starting Aug 14",
        confidence: 0.94,
        owner: "u-amelia",
      },
    ],
  },
  {
    id: "tr-3",
    ts: "00:07:52",
    speaker: "u-derek",
    text:
      "I'll just flag — Sales committed Halcyon and two of the wave-two accounts to a single August 14 launch. We can't move four of those into wave two without renegotiating their commercial terms.",
    extracted: [
      {
        kind: "risk",
        label: "Sales committed wave-two accounts to single Aug 14 launch — commercial conflict with phased plan",
        confidence: 0.91,
        owner: "u-derek",
      },
    ],
  },
  {
    id: "tr-4",
    ts: "00:11:09",
    speaker: "u-ravi",
    text:
      "Engineering can support wave one on the 14th with the new auth provider migration done by the 9th. Wave two adds load — we'd need the on-call rotation locked down before the 28th.",
    extracted: [
      {
        kind: "action",
        label: "Lock on-call rotation for wave two by Aug 26",
        confidence: 0.89,
        owner: "u-talia",
        due: "2026-08-26",
      },
    ],
  },
  {
    id: "tr-5",
    ts: "00:14:42",
    speaker: "u-amelia",
    text:
      "Let's plan for the phased approach but I'll own a working session with Derek this week to renegotiate the Halcyon commit. If we can hold Mercer in wave one but slip Halcyon's two sister accounts to wave two, we have a deal.",
    extracted: [
      {
        kind: "action",
        label: "Working session with Sales to renegotiate Halcyon commit",
        confidence: 0.96,
        owner: "u-amelia",
        due: "2026-04-30",
      },
    ],
  },
  {
    id: "tr-6",
    ts: "00:18:01",
    speaker: "u-stefan",
    text:
      "Okay. Decision: phased plan, Mercer + Halcyon flagship in wave one on the 14th, sister accounts and the four Sales-committed in wave two on the 28th. Amelia owns the renegotiation, Ravi owns engineering readiness, Maya owns CS communications by the end of next week.",
    extracted: [
      {
        kind: "action",
        label: "CS communications plan to enterprise customers",
        confidence: 0.92,
        owner: "u-maya",
        due: "2026-05-05",
      },
    ],
  },
  {
    id: "tr-7",
    ts: "00:21:20",
    speaker: "u-marcus",
    text:
      "What's the revenue exposure if wave two slips by a week? Just want that on the risk register.",
    extracted: [
      {
        kind: "risk",
        label: "Revenue exposure if wave-two slips — needs financial model",
        confidence: 0.78,
        owner: "u-marcus",
      },
    ],
  },
  {
    id: "tr-8",
    ts: "00:23:55",
    speaker: "u-stefan",
    text: "Liam, work with Amelia — let's have a one-week-slip scenario by Monday. Anything else?",
    extracted: [
      {
        kind: "action",
        label: "Wave-two slip scenario model",
        confidence: 0.88,
        owner: "u-liam",
        due: "2026-05-04",
      },
    ],
  },
];

export const HERO_MEETING_ID = "m-q3-roll-w11";

export const MEETINGS: Meeting[] = [
  {
    id: HERO_MEETING_ID,
    title: "Q3 Enterprise Rollout · Steering",
    series: "Q3 Enterprise Rollout · Steering (weekly)",
    status: "completed",
    startsAt: "Today · 09:00",
    duration: "45 min",
    durationMin: 45,
    organizer: "u-stefan",
    attendees: ["u-stefan", "u-priya", "u-amelia", "u-derek", "u-ravi", "u-maya", "u-marcus", "u-liam"],
    attendeesCount: 8,
    departments: ["Leadership", "Product", "Engineering", "Sales", "Customer Success", "Finance"],
    customer: "Halcyon Health · Mercer & Pratt",
    agendaItems: 4,
    decisionsCount: 1,
    actionsCount: 4,
    risksCount: 2,
    fourE: { engagement: 78, effectiveness: 82, execution: 68, efficiency: 74 },
    fourEPrev: { engagement: 86, effectiveness: 88, execution: 78, efficiency: 80 },
    impact: "high",
    highlight:
      "Phased rollout decided. Sales / Product priority conflict still open — needs cross-team alignment.",
    flag: { tone: "warning", label: "Engagement ↓ 8 pts" },
    transcript: heroTranscript,
  },
  {
    id: "m-leadership-w11",
    title: "Leadership Weekly",
    series: "Leadership Weekly",
    status: "completed",
    startsAt: "Today · 08:00",
    duration: "60 min",
    durationMin: 60,
    organizer: "u-priya",
    attendees: ["u-priya", "u-stefan", "u-amelia", "u-derek", "u-ravi", "u-maya", "u-marcus"],
    attendeesCount: 7,
    departments: ["Leadership"],
    decisionsCount: 2,
    actionsCount: 6,
    risksCount: 1,
    fourE: { engagement: 88, effectiveness: 84, execution: 82, efficiency: 86 },
    impact: "high",
    highlight: "Hiring plan signed off. Q3 rollout escalated for cross-team alignment.",
    flag: { tone: "success", label: "Strong execution" },
  },
  {
    id: "m-pipeline-w11",
    title: "Sales Pipeline Review",
    series: "Sales Pipeline Review (weekly)",
    status: "completed",
    startsAt: "Yesterday · 15:00",
    duration: "60 min",
    durationMin: 60,
    organizer: "u-derek",
    attendees: ["u-derek", "u-soraya", "u-stefan", "u-amelia"],
    attendeesCount: 4,
    departments: ["Sales", "Leadership", "Product"],
    decisionsCount: 1,
    actionsCount: 3,
    risksCount: 1,
    fourE: { engagement: 72, effectiveness: 76, execution: 84, efficiency: 70 },
    impact: "medium",
    highlight: "Pipeline ahead of plan; Halcyon commit conflict with Product flagged here first.",
  },
  {
    id: "m-product-strategy",
    title: "Product Strategy · Q3 Themes",
    status: "completed",
    startsAt: "Yesterday · 11:00",
    duration: "90 min",
    durationMin: 90,
    organizer: "u-amelia",
    attendees: ["u-amelia", "u-jonas", "u-ravi", "u-talia", "u-stefan"],
    attendeesCount: 5,
    departments: ["Product", "Engineering", "Leadership"],
    decisionsCount: 3,
    actionsCount: 8,
    risksCount: 0,
    fourE: { engagement: 92, effectiveness: 90, execution: 80, efficiency: 76 },
    impact: "high",
    highlight: "Three feature themes locked. Auth migration is the gating dependency.",
    flag: { tone: "accent", label: "Top decision density" },
  },
  {
    id: "m-cs-qbr",
    title: "Customer Success · QBR Prep",
    status: "completed",
    startsAt: "Yesterday · 13:30",
    duration: "45 min",
    durationMin: 45,
    organizer: "u-maya",
    attendees: ["u-maya", "u-devon", "u-derek", "u-amelia"],
    attendeesCount: 4,
    departments: ["Customer Success", "Sales", "Product"],
    decisionsCount: 1,
    actionsCount: 5,
    risksCount: 2,
    fourE: { engagement: 80, effectiveness: 78, execution: 64, efficiency: 72 },
    impact: "medium",
    highlight: "QBR template approved. Two enterprise accounts at churn risk if rollout slips.",
  },
  {
    id: "m-eng-retro-w10",
    title: "Engineering Retro · W10",
    series: "Engineering Retro (weekly)",
    status: "completed",
    startsAt: "Mon 14:30",
    duration: "30 min",
    durationMin: 30,
    organizer: "u-talia",
    attendees: ["u-talia", "u-ravi"],
    attendeesCount: 9,
    departments: ["Engineering"],
    decisionsCount: 0,
    actionsCount: 3,
    risksCount: 1,
    fourE: { engagement: 64, effectiveness: 58, execution: 70, efficiency: 90 },
    impact: "low",
    highlight: "Tightly run, but agenda heavy on status — recommend converting to async.",
    flag: { tone: "warning", label: "Async candidate" },
  },
  {
    id: "m-marketing-launch",
    title: "Q3 Launch Comms · Working Session",
    status: "in_progress",
    startsAt: "Now · 14:00 (live)",
    duration: "60 min",
    durationMin: 60,
    organizer: "u-elena",
    attendees: ["u-elena", "u-amelia", "u-maya"],
    attendeesCount: 3,
    departments: ["Marketing", "Product", "Customer Success"],
    decisionsCount: 0,
    actionsCount: 0,
    risksCount: 0,
    fourE: { engagement: 84, effectiveness: 0, execution: 0, efficiency: 0 },
    impact: "medium",
    highlight: "In progress · live transcription on.",
    flag: { tone: "accent", label: "Live" },
  },
  {
    id: "m-leadership-1on1",
    title: "Stefan ↔ Priya · 1:1",
    series: "Stefan ↔ Priya · 1:1 (weekly)",
    status: "upcoming",
    startsAt: "Tomorrow · 10:00",
    duration: "30 min",
    durationMin: 30,
    organizer: "u-stefan",
    attendees: ["u-stefan", "u-priya"],
    attendeesCount: 2,
    departments: ["Leadership"],
    decisionsCount: 0,
    actionsCount: 0,
    risksCount: 0,
    fourE: { engagement: 0, effectiveness: 0, execution: 0, efficiency: 0 },
    impact: "medium",
    preMeetingScore: 84,
    highlight: "Pre-meeting score 84 · agenda has clear outcome and 2 decision points.",
  },
  {
    id: "m-rollout-prep",
    title: "Q3 Rollout · Cross-Team Prep",
    status: "upcoming",
    startsAt: "Thu · 10:00",
    duration: "60 min",
    durationMin: 60,
    organizer: "u-amelia",
    attendees: ["u-amelia", "u-derek", "u-ravi", "u-maya"],
    attendeesCount: 4,
    departments: ["Product", "Sales", "Engineering", "Customer Success"],
    decisionsCount: 0,
    actionsCount: 0,
    risksCount: 0,
    fourE: { engagement: 0, effectiveness: 0, execution: 0, efficiency: 0 },
    impact: "high",
    preMeetingScore: 42,
    highlight:
      "Pre-meeting score 42 · agenda lacks decision owners and is missing InfoSec stakeholder. AI suggests 3 fixes before invite.",
    flag: { tone: "danger", label: "Low pre-meeting score" },
  },
];

export function meetingById(id: string) {
  return MEETINGS.find((m) => m.id === id);
}

export const HERO_MEETING = MEETINGS.find((m) => m.id === HERO_MEETING_ID)!;
