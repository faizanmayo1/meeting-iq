export type Integration = {
  id: string;
  name: string;
  category: "TMS" | "Telematics" | "Fuel" | "EDI" | "Maps" | "Comms" | "ELD";
  description: string;
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
  account?: string;
};

export const INTEGRATIONS: Integration[] = [
  {
    id: "mcleod",
    name: "McLeod LoadMaster",
    category: "TMS",
    description: "Loads, dispatch, billing — primary system of record.",
    status: "connected",
    lastSync: "12s ago",
    account: "APL-PROD-2241",
  },
  {
    id: "samsara",
    name: "Samsara",
    category: "Telematics",
    description: "GPS, ELD, dashcams. Streams every 30 seconds.",
    status: "connected",
    lastSync: "8s ago",
    account: "org_apl_cargo",
  },
  {
    id: "wex",
    name: "WEX Fleet Card",
    category: "Fuel",
    description: "Fuel transactions, station prices, card-level controls.",
    status: "connected",
    lastSync: "4m ago",
    account: "WEX-110482",
  },
  {
    id: "kleinschmidt",
    name: "Kleinschmidt EDI",
    category: "EDI",
    description: "EDI 204 / 210 / 214 / 990 with 38 customers.",
    status: "connected",
    lastSync: "21s ago",
    account: "ISA-APLCARGO",
  },
  {
    id: "trimble",
    name: "Trimble PC*MILER",
    category: "Maps",
    description: "Truck routing, mileage, toll calculation.",
    status: "connected",
    lastSync: "2m ago",
  },
  {
    id: "slack",
    name: "Slack",
    category: "Comms",
    description: "Posts AI alerts to #ops-room and #fleet.",
    status: "connected",
    lastSync: "now",
    account: "T024JG · #ops-room",
  },
  {
    id: "geotab",
    name: "Geotab",
    category: "Telematics",
    description: "Secondary telematics for spot rentals.",
    status: "disconnected",
    lastSync: "—",
  },
  {
    id: "ezpass",
    name: "E-ZPass Fleet",
    category: "Fuel",
    description: "Toll transponders. Sync paused — credentials expired.",
    status: "error",
    lastSync: "2 days ago",
    account: "EZP-APLC",
  },
];

export type Member = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Dispatcher" | "Fleet Mgr" | "Read only";
  department: string;
  lastActive: string;
  is2FA: boolean;
};

export const MEMBERS: Member[] = [
  { id: "m-1", name: "Stefan Trifan",   email: "stefan@aplcargo.com",   role: "Owner",      department: "Operations",  lastActive: "now",       is2FA: true },
  { id: "m-2", name: "Adnan Bashir",    email: "adnan@aplcargo.com",    role: "Admin",      department: "Engineering", lastActive: "3m ago",    is2FA: true },
  { id: "m-3", name: "Maya Cole",       email: "maya@aplcargo.com",     role: "Dispatcher", department: "Dispatch",    lastActive: "12m ago",   is2FA: true },
  { id: "m-4", name: "Devon Reyes",     email: "devon@aplcargo.com",    role: "Dispatcher", department: "Dispatch",    lastActive: "1h ago",    is2FA: false },
  { id: "m-5", name: "Priya Iyer",      email: "priya@aplcargo.com",    role: "Fleet Mgr",  department: "Fleet",       lastActive: "Today",     is2FA: true },
  { id: "m-6", name: "Marcus Doyle",    email: "marcus@aplcargo.com",   role: "Read only",  department: "Finance",     lastActive: "Yesterday", is2FA: true },
];

export type AISetting = {
  id: string;
  label: string;
  description: string;
  value: number;
  unit: "%" | "h" | "$" | "min";
  min: number;
  max: number;
};

export const AI_SETTINGS: AISetting[] = [
  {
    id: "auto-threshold",
    label: "Auto-action confidence floor",
    description:
      "MeetingIQ will auto-create tasks and trigger workflows only when extraction confidence is at or above this value. Below it, the item lands in your approval inbox.",
    value: 88,
    unit: "%",
    min: 60,
    max: 99,
  },
  {
    id: "engagement-drop",
    label: "Engagement drop sensitivity",
    description:
      "Trigger a meeting-quality alert when 4E engagement drops more than this many points week-over-week.",
    value: 6,
    unit: "%",
    min: 3,
    max: 20,
  },
  {
    id: "premeet-floor",
    label: "Pre-meeting score floor",
    description:
      "Send AI agenda suggestions to organizers when the pre-meeting impact score falls below this value.",
    value: 60,
    unit: "%",
    min: 40,
    max: 90,
  },
  {
    id: "overdue-escalate",
    label: "Action overdue escalation",
    description:
      "Auto-escalate to the owner's manager and add to the next 1:1 agenda after this many hours past due.",
    value: 24,
    unit: "h",
    min: 4,
    max: 96,
  },
];

export type NotificationRule = {
  id: string;
  label: string;
  channels: { email: boolean; slack: boolean; push: boolean };
};

export const NOTIFICATION_RULES: NotificationRule[] = [
  { id: "alignment-conflict", label: "Cross-team alignment conflict", channels: { email: true,  slack: true,  push: true  } },
  { id: "low-prep",           label: "Pre-meeting score < threshold", channels: { email: false, slack: true,  push: true  } },
  { id: "approval-needed",    label: "AI needs approval",             channels: { email: false, slack: true,  push: true  } },
  { id: "action-overdue",     label: "Owned action overdue",          channels: { email: true,  slack: true,  push: false } },
  { id: "summary",            label: "Daily AI summary",              channels: { email: true,  slack: false, push: false } },
];
