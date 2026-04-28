export type Integration = {
  id: string;
  name: string;
  category: "Calendar" | "Video" | "Comms" | "CRM" | "Project Mgmt" | "Docs" | "BI";
  description: string;
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
  account?: string;
  outcomes?: number;     // # of actions / decisions synced this week
};

export const INTEGRATIONS: Integration[] = [
  {
    id: "google-calendar",
    name: "Google Calendar",
    category: "Calendar",
    description: "Pulls every meeting, agenda, attendee list. Source of truth for upcoming agenda intelligence.",
    status: "connected",
    lastSync: "12s ago",
    account: "northwind.com workspace",
    outcomes: 142,
  },
  {
    id: "zoom",
    name: "Zoom",
    category: "Video",
    description: "Captures recordings + speaker-attributed transcripts. Powers 4E scoring and action extraction.",
    status: "connected",
    lastSync: "8s ago",
    account: "Pro · 200 hosts",
    outcomes: 1042,
  },
  {
    id: "ms-teams",
    name: "Microsoft Teams",
    category: "Video",
    description: "Secondary capture for departments on Teams. Same transcript pipeline.",
    status: "connected",
    lastSync: "32s ago",
    account: "tenant · northwind",
    outcomes: 318,
  },
  {
    id: "slack",
    name: "Slack",
    category: "Comms",
    description: "Posts AI summaries to #meetings, surfaces action confirmations, hosts approval inbox notifications.",
    status: "connected",
    lastSync: "now",
    account: "T024JG · #meetings",
    outcomes: 612,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    description: "Syncs decisions and customer-facing actions to Salesforce activity timeline.",
    status: "connected",
    lastSync: "21s ago",
    account: "PROD · Northwind",
    outcomes: 86,
  },
  {
    id: "jira",
    name: "Jira",
    category: "Project Mgmt",
    description: "Creates tickets from extracted action items. Engineering and Operations.",
    status: "connected",
    lastSync: "4m ago",
    account: "northwind.atlassian.net",
    outcomes: 248,
  },
  {
    id: "asana",
    name: "Asana",
    category: "Project Mgmt",
    description: "Action sync for Marketing, CS, and Customer-facing teams.",
    status: "connected",
    lastSync: "2m ago",
    account: "Northwind workspace",
    outcomes: 132,
  },
  {
    id: "notion",
    name: "Notion",
    category: "Docs",
    description: "Decision log + meeting summary archive. Read-only memory for the Knowledge Layer.",
    status: "connected",
    lastSync: "1m ago",
    account: "Workspace · Northwind",
    outcomes: 480,
  },
  {
    id: "linear",
    name: "Linear",
    category: "Project Mgmt",
    description: "Optional engineering ticket sync.",
    status: "disconnected",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    description: "Customer-success pipeline sync.",
    status: "disconnected",
  },
  {
    id: "tableau",
    name: "Tableau",
    category: "BI",
    description: "Pushes outcome metrics to Tableau dashboards.",
    status: "error",
    lastSync: "3 days ago",
    account: "tableau.northwind.com",
  },
];
