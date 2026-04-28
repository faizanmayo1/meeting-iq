import { useMemo, useState } from "react";
import { Search, Download, Plus, Sparkles, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatTile } from "@/components/data-display/StatTile";
import { MeetingsTable } from "@/features/meetings/MeetingsTable";
import { MeetingDetailSheet } from "@/features/meetings/MeetingDetailSheet";
import { MEETINGS, fourEAvg, type Meeting, type MeetingStatus } from "@/mocks/seed/meetings";
import { TENANT } from "@/mocks/seed/users";
import { cn } from "@/lib/utils";

const FILTERS: { key: "all" | MeetingStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "completed", label: "Completed" },
  { key: "in_progress", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
];

export default function MeetingsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Meeting | null>(null);

  const filtered = useMemo(() => {
    return MEETINGS.filter((m) => {
      if (filter !== "all" && m.status !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        (m.series ?? "").toLowerCase().includes(q) ||
        (m.customer ?? "").toLowerCase().includes(q) ||
        m.departments.join(" ").toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  const counts = useMemo(() => {
    const all = MEETINGS.length;
    const completed = MEETINGS.filter((m) => m.status === "completed").length;
    const live = MEETINGS.filter((m) => m.status === "in_progress").length;
    const upcoming = MEETINGS.filter((m) => m.status === "upcoming").length;
    const flagged = MEETINGS.filter(
      (m) => m.flag?.tone === "danger" || m.flag?.tone === "warning"
    ).length;
    const completedScores = MEETINGS.filter(
      (m) => m.status === "completed" || m.status === "in_progress"
    ).map((m) => fourEAvg(m.fourE));
    const avg4E = completedScores.length
      ? Math.round(completedScores.reduce((s, n) => s + n, 0) / completedScores.length)
      : 0;
    return { all, completed, live, upcoming, flagged, avg4E };
  }, []);

  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        title="Meetings"
        subtitle={
          <>
            Every meeting across the enterprise — ranked by outcome impact.
            <span className="text-ink-secondary"> {TENANT.totalMeetings.toLocaleString()} this quarter, {TENANT.weeksOfHistory} weeks of history.</span>
          </>
        }
        actions={
          <>
            <Button variant="secondary" size="md">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="primary" size="md">
              <Plus className="h-4 w-4" />
              New meeting
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          label="Visible"
          value={counts.all}
          note={`${counts.completed} completed · ${counts.live} live · ${counts.upcoming} upcoming`}
          icon={<CalendarDays className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Avg 4E score"
          value={counts.avg4E}
          note="across completed sessions"
          tone={counts.avg4E >= 80 ? "success" : counts.avg4E >= 70 ? "neutral" : "warning"}
        />
        <StatTile
          label="Need attention"
          value={counts.flagged}
          note="declining engagement or low pre-meeting score"
          tone={counts.flagged ? "warning" : "neutral"}
        />
        <StatTile
          label="Auto-extracted today"
          value="14"
          note="3 decisions · 9 actions · 2 risks"
          tone="accent"
        />
      </section>

      <Card className="overflow-hidden">
        <div className="p-4 flex items-center gap-3 border-b border-border-soft flex-wrap">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search by meeting, series, customer, department…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-full pl-9 pr-3 rounded-md border border-border-soft bg-subtle/40 text-body text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-surface transition-all"
            />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {FILTERS.map((f) => {
              const isActive = filter === f.key;
              const count =
                f.key === "all"
                  ? MEETINGS.length
                  : MEETINGS.filter((m) => m.status === f.key).length;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "h-8 px-3 rounded-md text-body-sm font-medium transition-colors flex items-center gap-1.5",
                    isActive
                      ? "bg-ink-primary text-ink-invert"
                      : "text-ink-secondary hover:bg-subtle hover:text-ink-primary"
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      "tabular-nums text-[11px] px-1.5 rounded",
                      isActive ? "bg-white/15" : "bg-subtle text-ink-muted"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3 flex items-center gap-2 border-b border-border-soft bg-subtle/30">
          <Sparkles className="h-3.5 w-3.5 text-accent-700" />
          <p className="text-body-sm text-ink-secondary">
            <span className="font-medium text-accent-700">AI ranked</span>{" "}
            <span className="font-medium text-ink-primary">{filtered.length}</span> meetings by outcome impact.
            Top three carry one-click recommendations.
          </p>
        </div>

        <MeetingsTable meetings={filtered} onOpen={setActive} />

        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-border-soft text-body-sm text-ink-muted">
          <span>
            Showing <span className="text-ink-primary font-medium tabular-nums">1–{filtered.length}</span> of{" "}
            <span className="tabular-nums">{TENANT.totalMeetings.toLocaleString()}</span> total
          </span>
          <div className="flex items-center gap-1">
            <button className="h-7 px-2.5 rounded-md hover:bg-subtle text-ink-muted">Prev</button>
            <button className="h-7 px-2.5 rounded-md hover:bg-subtle text-ink-muted">Next</button>
          </div>
        </div>
      </Card>

      <MeetingDetailSheet
        meeting={active}
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
      />
    </div>
  );
}
