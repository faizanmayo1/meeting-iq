import type { LoadStatus } from "@/lib/status";

export type AILoadRec = {
  id: string;
  label: string;
  description: string;
  impact: number;
  saveMinutes?: number;
  preferred?: boolean;
};

export type TimelineStop = {
  id: string;
  kind: "pickup" | "stop" | "delivery";
  location: string;
  address: string;
  scheduled: string;
  actual?: string;
  status: "completed" | "current" | "predicted-late" | "scheduled";
  note?: string;
};

export type LoadRow = {
  id: string;
  status: LoadStatus;
  origin: string;
  dest: string;
  driver: string;
  unit: string;
  etaDelta: number;
  customer: string;
  revenue: number;
  miles: number;
  weight: string;
  equipment: "Reefer" | "Dry Van" | "Flatbed";
  predictedDelay?: string;
  recommendations?: AILoadRec[];
  timeline?: TimelineStop[];
};

const HERO_TIMELINE: TimelineStop[] = [
  {
    id: "tl-1",
    kind: "pickup",
    location: "Atlanta, GA",
    address: "Walmart DC #6024 · 1450 Lakes Pkwy",
    scheduled: "Sun 04:30",
    actual: "Sun 04:14",
    status: "completed",
    note: "Loaded 14 min early",
  },
  {
    id: "tl-2",
    kind: "stop",
    location: "Birmingham, AL",
    address: "Pilot #311",
    scheduled: "Sun 09:10",
    actual: "Sun 08:56",
    status: "completed",
    note: "Fuel + 30-min break",
  },
  {
    id: "tl-3",
    kind: "stop",
    location: "I-40 / Forrest City, AR",
    address: "Re-route decision point",
    scheduled: "Sun 13:00",
    status: "current",
    note: "Closure ahead — re-route via I-22 saves 47 min",
  },
  {
    id: "tl-4",
    kind: "delivery",
    location: "Memphis, TN",
    address: "Walmart DC #6094 · 8000 Polk Ln",
    scheduled: "Sun 17:00",
    status: "predicted-late",
    note: "Predicted 19:14 (+2h 14m) without action",
  },
];

export const LOADS: LoadRow[] = [
  {
    id: "ATL-44219",
    status: "at_risk",
    origin: "Atlanta, GA",
    dest: "Memphis, TN",
    driver: "M. Garza",
    unit: "#217",
    etaDelta: 134,
    customer: "Walmart DC",
    revenue: 4200,
    miles: 394,
    weight: "42,800 lb",
    equipment: "Dry Van",
    predictedDelay: "+2h 14m",
    timeline: HERO_TIMELINE,
    recommendations: [
      {
        id: "reassign",
        label: "Re-assign to Unit #308",
        description: "Driver L. Cole, currently unloading 18 mi north. ETA gain 1h 20m.",
        impact: 340,
        saveMinutes: 80,
        preferred: true,
      },
      {
        id: "reroute",
        label: "Re-route via I-22",
        description: "Avoids the I-40 closure. Adds 11 mi but saves 47 min.",
        impact: 112,
        saveMinutes: 47,
      },
      {
        id: "rebroker",
        label: "Re-broker to partner carrier",
        description: "Frees Unit #217 for backhaul. Net-margin negative.",
        impact: -180,
        saveMinutes: 0,
      },
    ],
  },
  {
    id: "LAX-44231",
    status: "at_risk",
    origin: "Los Angeles, CA",
    dest: "Phoenix, AZ",
    driver: "J. Smith",
    unit: "#142",
    etaDelta: 48,
    customer: "Target",
    revenue: 3850,
    miles: 372,
    weight: "38,200 lb",
    equipment: "Reefer",
    predictedDelay: "+48m",
  },
  {
    id: "DFW-44247",
    status: "delayed",
    origin: "Dallas, TX",
    dest: "Houston, TX",
    driver: "R. Patel",
    unit: "#091",
    etaDelta: 220,
    customer: "Home Depot",
    revenue: 2900,
    miles: 240,
    weight: "44,100 lb",
    equipment: "Flatbed",
    predictedDelay: "+3h 40m",
  },
  {
    id: "SEA-44250",
    status: "at_risk",
    origin: "Seattle, WA",
    dest: "Portland, OR",
    driver: "A. Chen",
    unit: "#312",
    etaDelta: 22,
    customer: "Amazon",
    revenue: 2100,
    miles: 174,
    weight: "31,400 lb",
    equipment: "Dry Van",
    predictedDelay: "+22m",
  },
  {
    id: "ORD-44266",
    status: "at_risk",
    origin: "Chicago, IL",
    dest: "Detroit, MI",
    driver: "T. Williams",
    unit: "#188",
    etaDelta: 75,
    customer: "Ford Motor",
    revenue: 5200,
    miles: 282,
    weight: "47,000 lb",
    equipment: "Flatbed",
    predictedDelay: "+1h 15m",
  },
  {
    id: "MIA-44278",
    status: "on_time",
    origin: "Miami, FL",
    dest: "Jacksonville, FL",
    driver: "K. Rivera",
    unit: "#704",
    etaDelta: 0,
    customer: "Publix",
    revenue: 2400,
    miles: 348,
    weight: "33,900 lb",
    equipment: "Reefer",
  },
  {
    id: "DEN-44290",
    status: "on_time",
    origin: "Denver, CO",
    dest: "Salt Lake City, UT",
    driver: "B. Owens",
    unit: "#815",
    etaDelta: 0,
    customer: "Costco",
    revenue: 4600,
    miles: 525,
    weight: "41,200 lb",
    equipment: "Reefer",
  },
  {
    id: "BOS-44302",
    status: "delivered",
    origin: "Boston, MA",
    dest: "Albany, NY",
    driver: "P. Nguyen",
    unit: "#623",
    etaDelta: 0,
    customer: "Stop & Shop",
    revenue: 2200,
    miles: 168,
    weight: "29,800 lb",
    equipment: "Dry Van",
  },
  {
    id: "PHL-44315",
    status: "scheduled",
    origin: "Philadelphia, PA",
    dest: "Baltimore, MD",
    driver: "Unassigned",
    unit: "—",
    etaDelta: 0,
    customer: "Sysco",
    revenue: 1850,
    miles: 102,
    weight: "—",
    equipment: "Dry Van",
  },
  {
    id: "ATL-44318",
    status: "on_time",
    origin: "Atlanta, GA",
    dest: "Charlotte, NC",
    driver: "S. Khan",
    unit: "#512",
    etaDelta: 0,
    customer: "Lowe's",
    revenue: 2750,
    miles: 245,
    weight: "39,600 lb",
    equipment: "Dry Van",
  },
  {
    id: "DFW-44322",
    status: "on_time",
    origin: "Dallas, TX",
    dest: "Oklahoma City, OK",
    driver: "G. Park",
    unit: "#204",
    etaDelta: 0,
    customer: "Halliburton",
    revenue: 3300,
    miles: 206,
    weight: "44,800 lb",
    equipment: "Flatbed",
  },
  {
    id: "LAX-44339",
    status: "delivered",
    origin: "Los Angeles, CA",
    dest: "Las Vegas, NV",
    driver: "D. Foster",
    unit: "#926",
    etaDelta: 0,
    customer: "MGM Resorts",
    revenue: 3100,
    miles: 270,
    weight: "26,400 lb",
    equipment: "Dry Van",
  },
];

export const AT_RISK_LOADS: LoadRow[] = LOADS.filter(
  (l) => l.status === "at_risk" || l.status === "delayed"
);
