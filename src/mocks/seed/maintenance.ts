export type MaintSystem =
  | "engine"
  | "brakes"
  | "tires"
  | "transmission"
  | "electrical"
  | "cooling"
  | "after_treatment"
  | "telemetry";

export type RiskLevel = "high" | "medium" | "low";

export type Prediction = {
  id: string;
  unit: string;
  driver: string;
  system: MaintSystem;
  issue: string;
  probabilityPct: number;
  windowDays: string;
  windowMinDays: number;
  recommendedAt: string;
  recommendedAction: string;
  costAvoided: number;
  level: RiskLevel;
  trend: number[];
};

export const PREDICTIONS: Prediction[] = [
  {
    id: "p-217",
    unit: "#217",
    driver: "M. Garza",
    system: "engine",
    issue: "Injector wear pattern",
    probabilityPct: 78,
    windowDays: "6–9 days",
    windowMinDays: 6,
    recommendedAt: "Memphis terminal · Fri 14:00",
    recommendedAction: "Schedule injector service at next layover",
    costAvoided: 4200,
    level: "high",
    trend: [42, 48, 53, 58, 64, 70, 78],
  },
  {
    id: "p-091",
    unit: "#091",
    driver: "R. Patel",
    system: "cooling",
    issue: "Coolant temp variance",
    probabilityPct: 52,
    windowDays: "10–14 days",
    windowMinDays: 10,
    recommendedAt: "Houston terminal · next week",
    recommendedAction: "Pressure test cooling loop",
    costAvoided: 1800,
    level: "medium",
    trend: [22, 26, 30, 36, 42, 48, 52],
  },
  {
    id: "p-623",
    unit: "#623",
    driver: "P. Nguyen",
    system: "after_treatment",
    issue: "DEF dosing inconsistent",
    probabilityPct: 47,
    windowDays: "2–3 weeks",
    windowMinDays: 14,
    recommendedAt: "Boston yard · routine cycle",
    recommendedAction: "DEF injector inspection",
    costAvoided: 2200,
    level: "medium",
    trend: [18, 24, 28, 32, 38, 42, 47],
  },
  {
    id: "p-312",
    unit: "#312",
    driver: "A. Chen",
    system: "tires",
    issue: "Drive axle tread accelerated wear",
    probabilityPct: 38,
    windowDays: "21–28 days",
    windowMinDays: 21,
    recommendedAt: "Seattle yard · next visit",
    recommendedAction: "Tire rotation + alignment check",
    costAvoided: 980,
    level: "low",
    trend: [12, 14, 18, 22, 28, 32, 38],
  },
  {
    id: "p-103",
    unit: "#103",
    driver: "—",
    system: "telemetry",
    issue: "Cellular link degradation",
    probabilityPct: 64,
    windowDays: "Active",
    windowMinDays: 0,
    recommendedAt: "Mobile, AL · roadside",
    recommendedAction: "Modem swap · dispatch service vendor",
    costAvoided: 600,
    level: "high",
    trend: [10, 18, 26, 35, 48, 56, 64],
  },
  {
    id: "p-401",
    unit: "#401",
    driver: "—",
    system: "brakes",
    issue: "Routine brake service · in progress",
    probabilityPct: 100,
    windowDays: "Active",
    windowMinDays: 0,
    recommendedAt: "Northeast terminal",
    recommendedAction: "Service in progress · Day 2 of 3",
    costAvoided: 0,
    level: "low",
    trend: [60, 70, 80, 88, 94, 98, 100],
  },
];

export type WorkOrderStatus = "scheduled" | "in_progress" | "completed";

export type WorkOrder = {
  id: string;
  unit: string;
  title: string;
  scheduled: string;
  location: string;
  cost: number;
  vendor: string;
  status: WorkOrderStatus;
  technician?: string;
  completedAt?: string;
  source: "ai" | "manual";
};

export const WORK_ORDERS: WorkOrder[] = [
  {
    id: "wo-1042",
    unit: "#401",
    title: "Brake service · drum + pad replacement",
    scheduled: "Wed 08:00",
    location: "Northeast terminal",
    cost: 2150,
    vendor: "FleetWorks NE",
    status: "in_progress",
    technician: "J. Romero",
    source: "ai",
  },
  {
    id: "wo-1043",
    unit: "#103",
    title: "Telematics modem swap",
    scheduled: "Today 11:30",
    location: "Mobile, AL · roadside",
    cost: 380,
    vendor: "TruckCom Roadside",
    status: "scheduled",
    technician: "B. Vargas",
    source: "ai",
  },
  {
    id: "wo-1044",
    unit: "#217",
    title: "Injector service · diagnostic + replace",
    scheduled: "Fri 14:00",
    location: "Memphis terminal",
    cost: 1840,
    vendor: "FleetWorks SE",
    status: "scheduled",
    source: "ai",
  },
  {
    id: "wo-1045",
    unit: "#091",
    title: "Cooling loop pressure test",
    scheduled: "Next Tue 09:00",
    location: "Houston terminal",
    cost: 320,
    vendor: "FleetWorks SW",
    status: "scheduled",
    source: "ai",
  },
  {
    id: "wo-1038",
    unit: "#704",
    title: "PM-A · 25K mi service",
    scheduled: "Today 06:30",
    location: "Miami yard",
    cost: 480,
    vendor: "In-house",
    status: "completed",
    technician: "K. Patel",
    completedAt: "07:42 am",
    source: "manual",
  },
  {
    id: "wo-1039",
    unit: "#512",
    title: "DPF regen · forced cycle",
    scheduled: "Yesterday 19:00",
    location: "Atlanta yard",
    cost: 0,
    vendor: "In-house",
    status: "completed",
    technician: "M. Cole",
    completedAt: "20:18",
    source: "ai",
  },
];

export const HEALTH_DISTRIBUTION = [
  { range: "95–100", count: 6, tone: "success" as const },
  { range: "85–94", count: 5, tone: "info" as const },
  { range: "70–84", count: 3, tone: "warning" as const },
  { range: "<70", count: 1, tone: "danger" as const },
];
