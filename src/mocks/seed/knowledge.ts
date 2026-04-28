/** Knowledge Memory — natural-language search across the meeting graph. */

export type Citation = {
  kind: "meeting" | "decision" | "action" | "risk";
  id: string;
  label: string;          // displayed text
  meta?: string;          // small below-text (e.g. "Apr 28 · Stefan T.")
};

export type KnowledgeBlock =
  | { kind: "decision-card"; decisionId: string }
  | { kind: "action-list"; actionIds: string[] }
  | { kind: "risk-card"; riskId: string }
  | { kind: "timeline"; items: Array<{ ts: string; label: string; meta?: string }> };

export type ChatTurn =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      text: string;
      citations?: Citation[];
      block?: KnowledgeBlock;
      followups?: string[];
    };

export const SEEDED_THREAD: ChatTurn[] = [
  {
    id: "u-1",
    role: "user",
    text: "What did we decide about the Q3 enterprise rollout?",
  },
  {
    id: "a-1",
    role: "assistant",
    text:
      "**Phased plan, 3 waves.** Decided this morning in the **Q3 Enterprise Rollout · Steering**. Wave 1 — Halcyon Health flagship + Mercer & Pratt on **Aug 14**. Wave 2 — sister accounts and 4 Sales-committed accounts on **Aug 28**. Wave 3 — long-tail mid-September. There's an **open conflict** with Sales' single-launch commit that needs cross-team alignment before next steering.",
    block: { kind: "decision-card", decisionId: "d-rollout-phased" },
    citations: [
      { kind: "meeting", id: "m-q3-roll-w11", label: "Q3 Enterprise Rollout · Steering", meta: "Today · 09:00" },
      { kind: "decision", id: "d-rollout-phased", label: "Phase Q3 rollout in 3 waves" },
      { kind: "decision", id: "d-sales-aug14-commit", label: "Single Aug 14 launch commit", meta: "conflict" },
    ],
    followups: [
      "Show me the action items from that meeting",
      "What's the dollar exposure if wave 2 slips?",
    ],
  },
  {
    id: "u-2",
    role: "user",
    text: "Show me the action items from that meeting",
  },
  {
    id: "a-2",
    role: "assistant",
    text:
      "Four actions extracted, all owners assigned. Three are in progress; one is open with a Monday deadline. Three are auto-synced to Jira / Asana.",
    block: {
      kind: "action-list",
      actionIds: ["a-renegotiate-halcyon", "a-on-call-rotation", "a-cs-comms", "a-slip-scenario"],
    },
    citations: [
      { kind: "meeting", id: "m-q3-roll-w11", label: "Q3 Enterprise Rollout · Steering" },
    ],
    followups: [
      "Who owns the Halcyon renegotiation?",
      "Are any of these blocked?",
    ],
  },
];

export const SUGGESTED_PROMPTS = [
  "What did we decide about the Q3 enterprise rollout?",
  "Which customers are blocked on auth migration?",
  "Show me overdue actions across Product",
  "Who attended the most leadership meetings this quarter?",
  "Summarize today's exceptions",
  "Compare Product vs Leadership velocity",
];

export const RECENT_THREADS = [
  { id: "t-1", title: "Q3 enterprise rollout decisions", time: "now",       active: true },
  { id: "t-2", title: "Halcyon commercial commits — what changed?", time: "Yesterday" },
  { id: "t-3", title: "Why is Product team's velocity slipping?",   time: "2 days ago" },
  { id: "t-4", title: "Auth provider migration timeline",            time: "Apr 24" },
  { id: "t-5", title: "Tier-3 SLA proposal — who needs to sign off?", time: "Apr 22" },
  { id: "t-6", title: "Meeting overload patterns this quarter",      time: "Apr 20" },
];
