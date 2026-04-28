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
    id: "wf-eta",
    name: "Customer ETA notifications",
    trigger: "ETA delta ≥ 15 min",
    action: "Send EDI 214 + email customer ops",
    mode: "auto",
    enabled: true,
    runsToday: 42,
    successPct: 99.2,
    lastRun: "2m ago",
    saved: "2.3 dispatch hours",
  },
  {
    id: "wf-detention",
    name: "Detention auto-billing",
    trigger: "Dwell > 90 min at customer DC",
    action: "Generate EDI 210 + flag for dispatch",
    mode: "auto",
    enabled: true,
    runsToday: 6,
    successPct: 100,
    lastRun: "12m ago",
    saved: "$1,350 today",
  },
  {
    id: "wf-appt",
    name: "Appointment rescheduling",
    trigger: "Predicted arrival > delivery window",
    action: "Send EDI 990 reschedule request",
    mode: "auto",
    enabled: true,
    runsToday: 3,
    successPct: 96.8,
    lastRun: "47m ago",
  },
  {
    id: "wf-hos",
    name: "HOS exhaustion warnings",
    trigger: "Driver < 2h to HOS limit",
    action: "Notify driver + suggest re-assign",
    mode: "auto",
    enabled: true,
    runsToday: 11,
    successPct: 100,
    lastRun: "now",
  },
  {
    id: "wf-reroute",
    name: "Disruption re-routing",
    trigger: "Weather / closure on active lane",
    action: "Rank options · request approval",
    mode: "human_approval",
    enabled: true,
    runsToday: 4,
    successPct: 89.5,
    lastRun: "1h ago",
    saved: "+$1,128 protected",
  },
  {
    id: "wf-maint",
    name: "Predictive maintenance work orders",
    trigger: "Failure probability ≥ 70%",
    action: "Create WO at next terminal layover",
    mode: "auto",
    enabled: true,
    runsToday: 2,
    successPct: 95.0,
    lastRun: "3h ago",
    saved: "Avoided $4.2K",
  },
  {
    id: "wf-fuel",
    name: "Fuel arbitrage routing",
    trigger: "Price gap ≥ $0.15/gal · within 20mi",
    action: "Update fuel-stop in TMS",
    mode: "calibrating",
    enabled: true,
    runsToday: 18,
    successPct: 81.2,
    lastRun: "now",
    saved: "$1,840 / week",
  },
  {
    id: "wf-coach",
    name: "Driver coaching digest",
    trigger: "Weekly · Friday 16:00",
    action: "Email driver + manager",
    mode: "auto",
    enabled: true,
    runsToday: 0,
    successPct: 100,
    lastRun: "Yesterday",
  },
  {
    id: "wf-rebroker",
    name: "Margin-negative re-broker",
    trigger: "Predicted load margin < 0%",
    action: "Re-broker to partner carrier",
    mode: "off",
    enabled: false,
    runsToday: 0,
    successPct: 72.4,
    lastRun: "Disabled",
  },
];

export type ApprovalItem = {
  id: string;
  workflow: string;
  title: string;
  detail: string;
  load?: string;
  unit?: string;
  driver?: string;
  impact: string;          // human-readable impact
  saving?: string;
  age: string;
  severity: "critical" | "warning" | "info";
};

export const APPROVAL_INBOX: ApprovalItem[] = [
  {
    id: "ap-1",
    workflow: "wf-reroute",
    title: "Apply I-22 reroute to 3 Atlanta–Memphis loads",
    detail:
      "I-40 closure detected. Re-routing recovers 47 min and protects $112 margin per load.",
    load: "ATL-44219 +2",
    impact: "+47m / load",
    saving: "+$336",
    age: "4m",
    severity: "warning",
  },
  {
    id: "ap-2",
    workflow: "wf-hos",
    title: "Re-assign DFW-44247 to Unit #308",
    detail:
      "R. Patel will hit HOS in 1h 40m. L. Cole clears in 22m and is 18 mi north.",
    load: "DFW-44247",
    unit: "#308",
    driver: "R. Patel → L. Cole",
    impact: "ETA gain 1h 20m",
    saving: "+$340",
    age: "8m",
    severity: "critical",
  },
  {
    id: "ap-3",
    workflow: "wf-maint",
    title: "Schedule injector service · Unit #217",
    detail:
      "Predicted failure 6–9 days. Memphis terminal is the unit's natural Friday layover.",
    unit: "#217",
    impact: "6–9 day window",
    saving: "Avoid $4.2K",
    age: "23m",
    severity: "warning",
  },
  {
    id: "ap-4",
    workflow: "wf-reroute",
    title: "Team-driver pairing on DEN → SLC",
    detail:
      "AI projects 9 future loads on this lane benefit from team pairing. Confidence 72%.",
    load: "9 future loads",
    impact: "+1.2 hr / week / driver",
    saving: "+$1,080",
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
  { id: "r-1", time: "7:42 am", workflow: "Disruption re-routing",   outcome: "approved", detail: "I-22 reroute · 3 loads", saved: "+$336" },
  { id: "r-2", time: "7:31 am", workflow: "Customer ETA notifications", outcome: "auto", detail: "Walmart DC · ATL-44219 +2h 14m" },
  { id: "r-3", time: "7:18 am", workflow: "Predictive maintenance", outcome: "auto", detail: "Unit #401 brake service · Friday 14:00", saved: "Avoid $4.2K" },
  { id: "r-4", time: "6:54 am", workflow: "Margin-negative re-broker", outcome: "rejected", detail: "Net-margin negative · escalated" },
  { id: "r-5", time: "6:40 am", workflow: "HOS warnings", outcome: "approved", detail: "R. Patel · re-assign suggested" },
  { id: "r-6", time: "6:22 am", workflow: "Fuel arbitrage routing", outcome: "auto", detail: "Pilot → Loves · 18 trucks", saved: "$1,840 / wk" },
  { id: "r-7", time: "5:58 am", workflow: "Detention auto-billing", outcome: "auto", detail: "Walmart DC · $225 detention line", saved: "+$225" },
  { id: "r-8", time: "5:40 am", workflow: "Appointment rescheduling", outcome: "snoozed", detail: "ORD-44266 · dispatcher reviewing" },
];
