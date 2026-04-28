import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  GitBranch,
  Gauge,
  Sparkles,
  AlertTriangle,
  Bot,
  Library,
  GraduationCap,
  Settings,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }>;
  badge?: number | string;
  comingSoon?: boolean;
  ai?: boolean;
};

const PRIMARY: Item[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/meetings", label: "Meetings", icon: CalendarDays },
  { to: "/actions", label: "Actions & Decisions", icon: CheckSquare },
  { to: "/alignment", label: "Decision Graph", icon: GitBranch },
  { to: "/velocity", label: "Execution Velocity", icon: Gauge },
  { to: "/insights", label: "AI Insights", icon: Sparkles },
  { to: "/risks", label: "Risks & Blockers", icon: AlertTriangle, badge: 7 },
  { to: "/workflows", label: "Workflows", icon: Bot },
];

const INTELLIGENCE: Item[] = [
  { to: "/knowledge", label: "Knowledge Memory", icon: Library, ai: true },
  { to: "/coach", label: "AI Coach", icon: GraduationCap, ai: true },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex h-screen w-[248px] shrink-0 flex-col border-r border-border-soft bg-surface/90 backdrop-blur-sm">
      {/* Brand */}
      <div className="relative h-14 px-5 flex items-center gap-2.5 border-b border-border-soft">
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
        <div className="relative h-9 w-9 rounded-md bg-[linear-gradient(160deg,hsl(var(--brand-500)),hsl(var(--brand-700)))] grid place-items-center shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_2px_6px_-2px_rgba(122,46,28,0.4)]">
          <span className="font-display italic font-medium text-ink-invert text-[18px] leading-none translate-y-[-1px]">M</span>
          <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-surface" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display italic text-[18px] font-medium text-ink-primary tracking-tight">
            MeetingIQ
          </span>
          <span className="text-[9.5px] uppercase tracking-[0.18em] text-ink-muted mt-1 font-medium">
            Outcome Orchestration
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <SectionLabel>Operations</SectionLabel>
        <ul className="flex flex-col gap-0.5 mb-4">
          {PRIMARY.map((it) => (
            <NavItem key={it.to} item={it} />
          ))}
        </ul>

        <SectionLabel>Intelligence</SectionLabel>
        <ul className="flex flex-col gap-0.5 mb-4">
          {INTELLIGENCE.map((it) => (
            <NavItem key={it.to} item={it} />
          ))}
        </ul>
      </nav>

      {/* Bottom dock */}
      <div className="border-t border-border-soft p-3 space-y-2">
        <button className="w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-subtle transition-colors group">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[11px] font-semibold">
              NX
            </div>
            <div className="min-w-0">
              <p className="text-body-sm font-medium text-ink-primary truncate">Northwind Inc.</p>
              <p className="text-[11px] text-ink-muted truncate">Enterprise · 8 departments</p>
            </div>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 text-ink-muted shrink-0" />
        </button>
        <NavLink
          to="/settings"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-body-sm text-ink-muted hover:bg-subtle hover:text-ink-secondary"
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 pt-2 pb-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-ink-muted">
      {children}
    </div>
  );
}

function NavItem({ item }: { item: Item }) {
  const Icon = item.icon;
  return (
    <li>
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          cn(
            "group relative flex items-center gap-2.5 rounded-md pl-3 pr-2 py-1.5 text-body transition-colors",
            "text-ink-secondary hover:bg-subtle hover:text-ink-primary",
            isActive && "bg-brand-50 text-brand-700 font-medium hover:bg-brand-50"
          )
        }
        end={item.to === "/dashboard"}
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r bg-brand-500" />
            )}
            <Icon
              className={cn(
                "h-[16px] w-[16px] shrink-0",
                item.ai && "text-accent-500",
                isActive && !item.ai && "text-brand-600"
              )}
              strokeWidth={1.75}
            />
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge != null && (
              <span className="rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px] font-semibold text-ink-invert tabular-nums leading-none">
                {item.badge}
              </span>
            )}
            {item.comingSoon && (
              <span className="rounded-full bg-accent-50 text-accent-700 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider leading-none">
                Soon
              </span>
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}
