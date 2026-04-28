export type ExceptionSeverity = "critical" | "warning" | "info";
// Legacy FreightIQ types — old seeds/pages still on disk reference these.
// They're not used by any imported code in MeetingIQ.
export type LoadStatus = "on_time" | "at_risk" | "delayed" | "delivered" | "scheduled";
export type TruckStatus = "moving" | "idle" | "maintenance" | "offline";
export type MaintenanceSeverity = "high" | "medium" | "low";

type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "accent";

export const STATUS_TONE: Record<string, Tone> = {
  // generic severity
  critical: "danger",
  warning: "warning",
  info: "info",
  high: "danger",
  medium: "warning",
  low: "info",

  // meeting status
  completed: "success",
  in_progress: "accent",
  upcoming: "info",
  cancelled: "neutral",

  // meeting impact
  high_impact: "accent",
  medium_impact: "info",
  low_impact: "neutral",

  // decisions
  decided: "success",
  open: "info",
  blocked: "danger",
  conflict: "danger",

  // actions
  done: "success",
  overdue: "danger",
  assigned: "info",

  // risks
  auto_resolved: "accent",
  resolved: "success",

  // legacy (still used by pre-existing FreightIQ stub pages on disk)
  on_time: "success",
  delivered: "success",
  scheduled: "info",
  at_risk: "warning",
  idle: "warning",
  delayed: "danger",
  maintenance: "danger",
  offline: "neutral",
  moving: "success",
  on_duty: "success",
  off_duty: "neutral",
  hos_warning: "warning",
  hos_critical: "danger",
};

export const STATUS_LABEL: Record<string, string> = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
  high: "High",
  medium: "Medium",
  low: "Low",

  completed: "Completed",
  in_progress: "In progress",
  upcoming: "Upcoming",
  cancelled: "Cancelled",

  high_impact: "High impact",
  medium_impact: "Medium impact",
  low_impact: "Low impact",

  decided: "Decided",
  open: "Open",
  blocked: "Blocked",
  conflict: "In conflict",

  done: "Done",
  overdue: "Overdue",
  assigned: "Assigned",

  auto_resolved: "Auto-resolved",
  resolved: "Resolved",

  on_time: "On time",
  delivered: "Delivered",
  scheduled: "Scheduled",
  at_risk: "At risk",
  idle: "Idle",
  delayed: "Delayed",
  maintenance: "In service",
  offline: "Offline",
  moving: "Moving",
  on_duty: "On duty",
  off_duty: "Off duty",
  hos_warning: "HOS warning",
  hos_critical: "HOS critical",
};

export const TONE_CLASSES: Record<Tone, { bg: string; text: string; dot: string; ring: string }> = {
  success: {
    bg: "bg-success-50",
    text: "text-success-700",
    dot: "bg-success-500",
    ring: "ring-success-500/20",
  },
  warning: {
    bg: "bg-warning-50",
    text: "text-warning-700",
    dot: "bg-warning-500",
    ring: "ring-warning-500/20",
  },
  danger: {
    bg: "bg-danger-50",
    text: "text-danger-700",
    dot: "bg-danger-500",
    ring: "ring-danger-500/20",
  },
  info: {
    bg: "bg-brand-50",
    text: "text-brand-700",
    dot: "bg-brand-500",
    ring: "ring-brand-500/20",
  },
  accent: {
    bg: "bg-accent-50",
    text: "text-accent-700",
    dot: "bg-accent-500",
    ring: "ring-accent-500/20",
  },
  neutral: {
    bg: "bg-subtle",
    text: "text-ink-secondary",
    dot: "bg-ink-muted",
    ring: "ring-ink-muted/20",
  },
};
