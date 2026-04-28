export type LaneRow = {
  lane: string;
  loads: number;
  avgDelay: number;
  cause: string;
};

export const WORST_LANES: LaneRow[] = [
  { lane: "ATL → MEM", loads: 18, avgDelay: 94, cause: "I-40 closure (recurring)" },
  { lane: "DFW → HOU", loads: 14, avgDelay: 71, cause: "Customer dwell at Home Depot DC" },
  { lane: "ORD → DTW", loads: 11, avgDelay: 53, cause: "Border-tunnel congestion" },
  { lane: "LAX → PHX", loads: 22, avgDelay: 38, cause: "I-10 weather events" },
  { lane: "DEN → SLC", loads: 9, avgDelay: 24, cause: "Driver pool depth" },
];

export type HOSDriver = {
  name: string;
  unit: string;
  hoursLeft: string;
  load: string;
  status: "critical" | "warning";
};

export const HOS_DRIVERS: HOSDriver[] = [
  { name: "R. Patel",   unit: "#091", hoursLeft: "1h 40m", load: "DFW-44247", status: "critical" },
  { name: "T. Williams", unit: "#188", hoursLeft: "2h 15m", load: "ORD-44266", status: "warning"  },
  { name: "J. Smith",   unit: "#142", hoursLeft: "3h 05m", load: "LAX-44231", status: "warning"  },
];

export type ChatTurn =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      text: string;
      block?:
        | { kind: "lane-chart"; data: LaneRow[] }
        | { kind: "hos-list"; drivers: HOSDriver[] }
        | { kind: "summary"; bullets: string[] };
      followups?: string[];
    };

export const SEEDED_THREAD: ChatTurn[] = [
  {
    id: "u-1",
    role: "user",
    text: "What's our worst lane this month and why?",
  },
  {
    id: "a-1",
    role: "assistant",
    text:
      "**Atlanta → Memphis** is your worst lane this month — 18 loads averaged 94 minutes late. The driver is the I-40 closure that re-opens around June 12. Rerouting via I-22 recovers ~47 minutes per load.",
    block: { kind: "lane-chart", data: WORST_LANES },
    followups: [
      "Can you re-route the affected loads automatically?",
      "What's the dollar impact of those delays?",
    ],
  },
  {
    id: "u-2",
    role: "user",
    text: "Show me drivers near HOS exhaustion",
  },
  {
    id: "a-2",
    role: "assistant",
    text:
      "Three drivers will hit HOS limits inside the next 4 hours. R. Patel is critical — re-assigning their delivery to Unit #308 keeps the load on time and avoids a roadside layover.",
    block: { kind: "hos-list", drivers: HOS_DRIVERS },
    followups: [
      "Re-assign R. Patel's load to Unit #308",
      "Notify the customer of the change",
    ],
  },
];

export const SUGGESTED_PROMPTS = [
  "What changed in our cost-per-mile this week?",
  "Forecast next week's fuel cost",
  "Which customers had the most detention this month?",
  "Predict which trucks will need maintenance in 30 days",
  "Summarize today's exceptions",
  "Compare on-time delivery this week vs last",
];

export const RECENT_THREADS = [
  { id: "t-1", title: "Worst lanes this month", time: "now", active: true },
  { id: "t-2", title: "Why did margin drop 80 bps last week?", time: "Yesterday" },
  { id: "t-3", title: "Detention summary — Walmart DC", time: "2 days ago" },
  { id: "t-4", title: "Predicted maintenance — Q2", time: "Apr 24" },
  { id: "t-5", title: "Driver utilization by region", time: "Apr 22" },
  { id: "t-6", title: "Fuel arbitrage on I-30 corridor", time: "Apr 20" },
];
