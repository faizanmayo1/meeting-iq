export type Capability = {
  key: "eta" | "route" | "demand" | "maintenance" | "exception" | "fuel";
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
    key: "eta",
    title: "ETA prediction",
    blurb: "Predicts arrival 4–24 hours out using telematics, weather, and traffic.",
    metric: "94%",
    metricLabel: "accuracy · ±12 min",
    accuracy: 94,
    trend: [90, 91, 92, 92.5, 93, 93.4, 94],
    status: "live",
  },
  {
    key: "route",
    title: "Route optimization",
    blurb: "Recommends re-routes when disruptions threaten margin or SLAs.",
    metric: "47 min",
    metricLabel: "avg saved per re-route",
    accuracy: 88,
    trend: [38, 41, 43, 44, 45, 46, 47],
    status: "live",
  },
  {
    key: "demand",
    title: "Demand forecast",
    blurb: "Projects load volume by region 7–30 days ahead.",
    metric: "+18%",
    metricLabel: "demand · Southeast next 7d",
    accuracy: 86,
    trend: [4, 6, 9, 11, 13, 15, 18],
    status: "live",
  },
  {
    key: "maintenance",
    title: "Predictive maintenance",
    blurb: "Flags failure risk 6–9 days before roadside breakdown.",
    metric: "3",
    metricLabel: "trucks flagged · 14 days",
    accuracy: 82,
    trend: [1, 1, 2, 2, 3, 3, 3],
    status: "live",
  },
  {
    key: "exception",
    title: "Exception triage",
    blurb: "Auto-resolves routine exceptions, escalates judgment calls.",
    metric: "62%",
    metricLabel: "auto-resolved this week",
    accuracy: 91,
    trend: [40, 45, 50, 54, 58, 60, 62],
    status: "live",
  },
  {
    key: "fuel",
    title: "Fuel arbitrage",
    blurb: "Re-routes refueling stops based on station price gradient.",
    metric: "$1.8K",
    metricLabel: "weekly saving",
    accuracy: 93,
    trend: [0.6, 0.9, 1.1, 1.3, 1.5, 1.7, 1.8],
    status: "calibrating",
  },
];

export type LaneOptRow = {
  lane: string;
  loads: number;
  current: string;
  recommended: string;
  saveMin: number;
  saveDollars: number;
  confidence: number;
  status: "review" | "approved" | "running";
};

export const LANE_OPTS: LaneOptRow[] = [
  {
    lane: "ATL → MEM",
    loads: 18,
    current: "I-40 · 394 mi",
    recommended: "I-22 reroute · 405 mi",
    saveMin: 47,
    saveDollars: 336,
    confidence: 94,
    status: "review",
  },
  {
    lane: "DFW → HOU",
    loads: 14,
    current: "I-45 direct",
    recommended: "Stagger pickups by 90m",
    saveMin: 28,
    saveDollars: 224,
    confidence: 88,
    status: "review",
  },
  {
    lane: "ORD → DTW",
    loads: 11,
    current: "Border tunnel",
    recommended: "Bridge crossing · -$0.04/mi fuel",
    saveMin: 14,
    saveDollars: 168,
    confidence: 81,
    status: "approved",
  },
  {
    lane: "LAX → PHX",
    loads: 22,
    current: "I-10 standard",
    recommended: "Pre-dawn departure",
    saveMin: 22,
    saveDollars: 506,
    confidence: 79,
    status: "running",
  },
  {
    lane: "DEN → SLC",
    loads: 9,
    current: "Single driver",
    recommended: "Team-driver pairing",
    saveMin: 0,
    saveDollars: 1080,
    confidence: 72,
    status: "review",
  },
];

export type ForecastRow = { week: string; Southeast: number; West: number; Midwest: number; Northeast: number };

export const DEMAND_FORECAST: ForecastRow[] = [
  { week: "W-2", Southeast: 142, West: 118, Midwest: 96,  Northeast: 64 },
  { week: "W-1", Southeast: 148, West: 122, Midwest: 102, Northeast: 68 },
  { week: "Now", Southeast: 156, West: 124, Midwest: 108, Northeast: 70 },
  { week: "W+1", Southeast: 168, West: 128, Midwest: 110, Northeast: 72 },
  { week: "W+2", Southeast: 182, West: 132, Midwest: 112, Northeast: 74 },
  { week: "W+3", Southeast: 188, West: 134, Midwest: 114, Northeast: 75 },
  { week: "W+4", Southeast: 184, West: 130, Midwest: 116, Northeast: 76 },
];

export type AIDecision = {
  id: string;
  time: string;
  action: string;
  detail: string;
  outcome: "auto" | "human" | "rejected";
  saved?: string;
};

export const AI_DECISIONS: AIDecision[] = [
  {
    id: "ai-1",
    time: "7:42 am",
    action: "Re-route ATL → MEM via I-22",
    detail: "3 loads · I-40 closure detected",
    outcome: "human",
    saved: "+$336 / 47m",
  },
  {
    id: "ai-2",
    time: "7:31 am",
    action: "Sent ETA update to Walmart DC",
    detail: "Load ATL-44219 · predicted +2h 14m",
    outcome: "auto",
  },
  {
    id: "ai-3",
    time: "7:18 am",
    action: "Scheduled Unit #401 brake service",
    detail: "Memphis terminal · Friday 14:00",
    outcome: "auto",
    saved: "Avoided $4.2K roadside",
  },
  {
    id: "ai-4",
    time: "6:54 am",
    action: "Re-broker DFW → HOU load proposed",
    detail: "Net-margin negative · escalated to dispatch",
    outcome: "rejected",
  },
  {
    id: "ai-5",
    time: "6:40 am",
    action: "HOS warning — R. Patel",
    detail: "Suggested re-assign to Unit #308",
    outcome: "human",
  },
  {
    id: "ai-6",
    time: "6:22 am",
    action: "Fuel stop swapped Pilot → Loves",
    detail: "I-30 corridor · 18 trucks affected",
    outcome: "auto",
    saved: "$1,840 / week",
  },
];
