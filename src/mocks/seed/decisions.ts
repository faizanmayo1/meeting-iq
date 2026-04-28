import type { Department } from "./users";

export type DecisionStatus = "decided" | "open" | "blocked" | "conflict";
export type DecisionImpact = "high" | "medium" | "low";

export type Decision = {
  id: string;
  title: string;
  description: string;
  status: DecisionStatus;
  impact: DecisionImpact;
  owner: string;       // user id
  meetingId: string;   // origin meeting
  createdAt: string;
  due?: string;
  departments: Department[];
  conflictWith?: string;          // decision id
  alignmentRiskPct?: number;      // 0–100
  dependsOn?: string[];           // decision ids
};

export const DECISIONS: Decision[] = [
  {
    id: "d-rollout-phased",
    title: "Phase Q3 Enterprise Rollout in 3 waves",
    description:
      "Wave 1 — Halcyon Health flagship + Mercer & Pratt on Aug 14. Wave 2 — sister accounts and 4 Sales-committed accounts on Aug 28. Wave 3 — long-tail mid-September.",
    status: "decided",
    impact: "high",
    owner: "u-amelia",
    meetingId: "m-q3-roll-w11",
    createdAt: "Today · 09:18",
    due: "2026-08-14",
    departments: ["Product", "Engineering", "Sales", "Customer Success"],
    conflictWith: "d-sales-aug14-commit",
    alignmentRiskPct: 72,
    dependsOn: ["d-auth-migration"],
  },
  {
    id: "d-sales-aug14-commit",
    title: "Single Aug 14 launch for 6 enterprise accounts",
    description:
      "Sales committed Halcyon, Mercer, and 4 wave-two accounts to a single August 14 launch in pricing negotiation. Conflicts with Product's phased plan.",
    status: "conflict",
    impact: "high",
    owner: "u-derek",
    meetingId: "m-pipeline-w11",
    createdAt: "Yesterday · 15:42",
    departments: ["Sales", "Product"],
    conflictWith: "d-rollout-phased",
    alignmentRiskPct: 72,
  },
  {
    id: "d-auth-migration",
    title: "Migrate to new auth provider by Aug 9",
    description:
      "Engineering to complete migration to the new SSO/SCIM provider. Wave-one launch is gated on this.",
    status: "blocked",
    impact: "high",
    owner: "u-ravi",
    meetingId: "m-product-strategy",
    createdAt: "Yesterday · 11:34",
    due: "2026-08-09",
    departments: ["Engineering", "Product"],
    alignmentRiskPct: 38,
  },
  {
    id: "d-hiring-q3",
    title: "Hire 6 enterprise reps in Q3",
    description:
      "Sales hiring plan signed off in Leadership Weekly. 4 in NA, 2 in EMEA. Recruiting kickoff this week.",
    status: "decided",
    impact: "medium",
    owner: "u-derek",
    meetingId: "m-leadership-w11",
    createdAt: "Today · 08:46",
    due: "2026-09-30",
    departments: ["Sales", "Leadership", "Finance"],
  },
  {
    id: "d-q3-themes",
    title: "Lock 3 Q3 product themes",
    description:
      "Themes — Enterprise scale, Workflow automation, Cross-team analytics. Auth migration is the gating dependency.",
    status: "decided",
    impact: "high",
    owner: "u-amelia",
    meetingId: "m-product-strategy",
    createdAt: "Yesterday · 12:18",
    departments: ["Product", "Engineering"],
    dependsOn: ["d-auth-migration"],
  },
  {
    id: "d-tier3-sla",
    title: "Reduce SLA on Tier-3 customers",
    description:
      "Customer Success proposed reducing Tier-3 SLA from 24h to 48h to free up capacity for enterprise rollout. Open — needs CS Lead + Sales sign-off.",
    status: "open",
    impact: "medium",
    owner: "u-maya",
    meetingId: "m-cs-qbr",
    createdAt: "Yesterday · 13:55",
    due: "2026-05-08",
    departments: ["Customer Success", "Sales"],
  },
  {
    id: "d-vendor-y",
    title: "Partner with Vendor Y on integrations",
    description:
      "Build vs buy on the integrations layer. Open — Engineering + Product to bring options Friday.",
    status: "open",
    impact: "medium",
    owner: "u-ravi",
    meetingId: "m-product-strategy",
    createdAt: "Yesterday · 12:38",
    due: "2026-05-02",
    departments: ["Engineering", "Product"],
  },
  {
    id: "d-pause-feature-x",
    title: "Pause Feature X for Q3",
    description:
      "Resource decision. Reallocate Feature X engineers to enterprise rollout team through end of August.",
    status: "decided",
    impact: "low",
    owner: "u-jonas",
    meetingId: "m-product-strategy",
    createdAt: "Yesterday · 12:52",
    departments: ["Product", "Engineering"],
  },
];

export const HERO_DECISION = DECISIONS.find((d) => d.id === "d-rollout-phased")!;

export function decisionById(id: string) {
  return DECISIONS.find((d) => d.id === id);
}
