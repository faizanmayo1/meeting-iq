export type Insight = {
  id: string;
  category: "alignment" | "engagement" | "execution" | "overload" | "predictive" | "knowledge";
  headline: string;
  body: string;
  impact?: string;
  cta: string;
  href?: string;
  createdAt: string;
};

export const INSIGHTS: Insight[] = [
  {
    id: "i-conflict",
    category: "alignment",
    headline: "Product / Sales priority conflict on Q3 rollout",
    body: "Phased plan decided in today's Q3 Steering conflicts with Sales' Aug 14 customer commits. Product and Sales discussed it in separate meetings — no joint resolution yet.",
    impact: "$1.2M wave-two revenue at risk",
    cta: "Schedule alignment meeting",
    createdAt: "8 min ago",
  },
  {
    id: "i-engagement",
    category: "engagement",
    headline: "Q3 Steering · engagement down 8 pts",
    body: "Speaker balance skewed (Sales VP 41%), three attendees did not speak, decision points compressed into the last 6 minutes. Recommend agenda restructure before next session.",
    impact: "Projected next score: 88 with fixes",
    cta: "Apply AI agenda fix",
    createdAt: "23 min ago",
  },
  {
    id: "i-overload",
    category: "overload",
    headline: "Product team · 40% more meeting time, fewer completed actions",
    body: "Product spent 40% more time in meetings vs company avg over 4 weeks but completed 22% fewer assigned actions. Two recurring meetings flagged for consolidation.",
    impact: "Reclaim ~6 hr/wk per IC",
    cta: "Review consolidation candidates",
    createdAt: "1 hr ago",
  },
  {
    id: "i-predictive",
    category: "predictive",
    headline: "Tomorrow's Q3 Rollout Prep · pre-meeting score 42",
    body: "Agenda lacks decision owners and is missing the InfoSec stakeholder. AI projects ≤ 1 actionable outcome from this meeting unless it's restructured before the invite goes out.",
    impact: "AI suggests 3 fixes",
    cta: "Coach the meeting",
    createdAt: "47 min ago",
  },
];
