import type { ExceptionSeverity } from "@/lib/status";

export type ExceptionKind =
  | "detention"
  | "hos"
  | "missed_appointment"
  | "weather"
  | "breakdown"
  | "route_deviation"
  | "fuel_anomaly"
  | "geo_off_lane";

export type ExceptionState = "open" | "in_progress" | "auto_resolved" | "resolved";

export type ExceptionResolution = {
  id: string;
  label: string;
  description: string;
  recommended?: boolean;
  destructive?: boolean;
};

export type ExceptionRow = {
  id: string;
  severity: ExceptionSeverity;
  kind: ExceptionKind;
  state: ExceptionState;
  title: string;
  load: string;
  driver: string;
  customer?: string;
  unit?: string;
  age: string;
  ageMinutes: number;
  detail: string;
  etaImpact?: string;
  dollarImpact?: number;
  resolution: string;          // headline (compact list)
  resolutions?: ExceptionResolution[]; // expanded options for sheet
};

export const EXCEPTIONS: ExceptionRow[] = [
  {
    id: "ex-44219-d",
    severity: "critical",
    kind: "detention",
    state: "open",
    title: "Detention at Walmart DC > 90 min",
    load: "ATL-44219",
    driver: "M. Garza",
    customer: "Walmart DC",
    unit: "#217",
    age: "12m",
    ageMinutes: 12,
    detail:
      "Driver dwell at Walmart DC #6094 has exceeded the 90-minute free time. Detention is now billable at $75/hr. SLA at risk on follow-on load ATL-44318.",
    etaImpact: "+0h 0m (delivery on site)",
    dollarImpact: 225,
    resolution: "Notify shipper · Bill detention",
    resolutions: [
      {
        id: "auto-bill",
        label: "Auto-bill detention + notify shipper",
        description: "Generates EDI 210 with $225 detention line, emails Walmart logistics ops, audit logged.",
        recommended: true,
      },
      {
        id: "release",
        label: "Release driver — defer billing",
        description: "Driver leaves yard now; detention dispute opened for billing review.",
      },
      {
        id: "wait",
        label: "Wait 30 min more",
        description: "Snooze the exception. Margin impact climbs $37/30m.",
      },
    ],
  },
  {
    id: "ex-44247-h",
    severity: "critical",
    kind: "hos",
    state: "open",
    title: "HOS exhaustion in 1h 40m",
    load: "DFW-44247",
    driver: "R. Patel",
    customer: "Home Depot",
    unit: "#091",
    age: "8m",
    ageMinutes: 8,
    detail:
      "R. Patel will hit 11-hour driving limit before delivery. Continuing risks a HOS violation and a forced 10-hour reset roadside.",
    etaImpact: "+3h 40m if forced reset",
    dollarImpact: 540,
    resolution: "Re-assign to Unit #308",
    resolutions: [
      {
        id: "reassign",
        label: "Re-assign load to Unit #308 (L. Cole)",
        description: "L. Cole unloading 18 mi north, clears in 22m. ETA recovers 1h 20m.",
        recommended: true,
      },
      {
        id: "stop",
        label: "Force layover at TA Forrest City",
        description: "Driver legally compliant; 10-hour reset begins.",
      },
      {
        id: "rebroker",
        label: "Re-broker to partner carrier",
        description: "Frees the unit. Net-margin: -$180.",
        destructive: true,
      },
    ],
  },
  {
    id: "ex-44266-m",
    severity: "warning",
    kind: "missed_appointment",
    state: "open",
    title: "Missed appointment window",
    load: "ORD-44266",
    driver: "T. Williams",
    customer: "Ford Motor",
    unit: "#188",
    age: "3m",
    ageMinutes: 3,
    detail:
      "Delivery window 14:00–15:00 missed by predicted 1h 15m. Ford auto-rejects past 16:00 — load goes to next-day reschedule fee tier.",
    etaImpact: "+1h 15m",
    dollarImpact: 320,
    resolution: "Reschedule via EDI 990",
    resolutions: [
      {
        id: "edi990",
        label: "Auto-send EDI 990 reschedule",
        description: "Requests next 4-hour window. Confirms to driver and customer.",
        recommended: true,
      },
      {
        id: "expedite",
        label: "Expedite delivery (driver bonus)",
        description: "Driver continues at +5 mph average. Marginal HOS risk.",
      },
    ],
  },
  {
    id: "ex-217-fuel",
    severity: "warning",
    kind: "fuel_anomaly",
    state: "open",
    title: "Fuel efficiency drop — Unit #217",
    load: "ATL-44219",
    driver: "M. Garza",
    unit: "#217",
    age: "1h 24m",
    ageMinutes: 84,
    detail:
      "Trailing-7-day MPG down 14% (7.1 → 6.1). Pattern matches injector wear signature. Predicted failure window 6–9 days.",
    etaImpact: "—",
    dollarImpact: 4200,
    resolution: "Schedule injector service",
    resolutions: [
      {
        id: "schedule-mem",
        label: "Schedule service at Memphis terminal",
        description: "Truck naturally lays over Friday post-delivery. Avoids $4.2K roadside repair.",
        recommended: true,
      },
      {
        id: "monitor",
        label: "Monitor for 48h",
        description: "Re-evaluate after additional telematics samples.",
      },
    ],
  },
  {
    id: "ex-091-geo",
    severity: "warning",
    kind: "route_deviation",
    state: "in_progress",
    title: "Off planned route by 3.2 mi",
    load: "DFW-44247",
    driver: "R. Patel",
    unit: "#091",
    age: "18m",
    ageMinutes: 18,
    detail:
      "Driver took US-77 instead of I-45. Adds 11 minutes; outside acceptable variance.",
    resolution: "Driver notified · monitoring",
  },
  {
    id: "ex-401-maint",
    severity: "warning",
    kind: "breakdown",
    state: "in_progress",
    title: "Brake service in progress — Unit #401",
    load: "—",
    driver: "—",
    unit: "#401",
    age: "Day 2",
    ageMinutes: 2880,
    detail:
      "Scheduled brake service ongoing at Northeast terminal. Expected completion Friday 14:00.",
    resolution: "On schedule",
  },
  {
    id: "ex-103-tel",
    severity: "warning",
    kind: "geo_off_lane",
    state: "open",
    title: "Telemetry offline — Unit #103",
    load: "—",
    driver: "—",
    unit: "#103",
    age: "1h 12m",
    ageMinutes: 72,
    detail: "Last known position south of Mobile, AL. Cellular link dropped at 06:30.",
    resolution: "Dispatch contact attempt",
  },
  {
    id: "ex-laxphx-w",
    severity: "info",
    kind: "weather",
    state: "auto_resolved",
    title: "Weather alert — I-10 monsoon · resolved",
    load: "LAX-44231",
    driver: "J. Smith",
    unit: "#142",
    age: "2h 4m",
    ageMinutes: 124,
    detail: "Monsoon advisory cleared at 07:15. Routing remains optimal.",
    resolution: "Auto-cleared",
  },
];

export const EXCEPTION_PREVIEW = EXCEPTIONS.filter((e) => e.state === "open").slice(0, 3);
