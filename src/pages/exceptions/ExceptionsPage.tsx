import { useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Bot,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardCaption, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/data-display/StatTile";
import { ExceptionItem } from "@/features/exceptions/ExceptionItem";
import { ExceptionDetailSheet } from "@/features/exceptions/ExceptionDetailSheet";
import { EXCEPTIONS, type ExceptionRow } from "@/mocks/seed/exceptions";
import { cn } from "@/lib/utils";

const STATE_FILTERS = [
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In progress" },
  { key: "auto_resolved", label: "Auto-resolved" },
  { key: "all", label: "All" },
] as const;

const SEV_FILTERS = [
  { key: "all", label: "All severity" },
  { key: "critical", label: "Critical" },
  { key: "warning", label: "Warning" },
  { key: "info", label: "Info" },
] as const;

type StateKey = (typeof STATE_FILTERS)[number]["key"];
type SevKey = (typeof SEV_FILTERS)[number]["key"];

export default function ExceptionsPage() {
  const [stateF, setStateF] = useState<StateKey>("open");
  const [sevF, setSevF] = useState<SevKey>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<ExceptionRow | null>(null);

  const filtered = useMemo(() => {
    return EXCEPTIONS.filter((e) => {
      if (stateF !== "all") {
        if (stateF === "open" && e.state !== "open" && e.state !== "in_progress") return false;
        if (stateF === "in_progress" && e.state !== "in_progress") return false;
        if (stateF === "auto_resolved" && e.state !== "auto_resolved") return false;
      }
      if (sevF !== "all" && e.severity !== sevF) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.load.toLowerCase().includes(q) ||
        e.driver.toLowerCase().includes(q) ||
        (e.unit ?? "").toLowerCase().includes(q) ||
        (e.customer ?? "").toLowerCase().includes(q)
      );
    });
  }, [stateF, sevF, query]);

  const counts = useMemo(() => {
    const open = EXCEPTIONS.filter((e) => e.state === "open").length;
    const inProg = EXCEPTIONS.filter((e) => e.state === "in_progress").length;
    const auto = 14; // includes today's auto-resolves we keep referenced in dashboard story
    const critical = EXCEPTIONS.filter((e) => e.severity === "critical" && (e.state === "open" || e.state === "in_progress")).length;
    const at_stake = EXCEPTIONS
      .filter((e) => e.state === "open" || e.state === "in_progress")
      .reduce((s, e) => s + (e.dollarImpact ?? 0), 0);
    return { open, inProg, auto, critical, at_stake };
  }, []);

  const heroException = EXCEPTIONS.find((e) => e.severity === "critical" && e.state === "open") ?? EXCEPTIONS[0];

  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        title="Exceptions"
        subtitle="The triaged queue. AI ranks by margin-at-stake and pre-fills the resolution — your dispatchers approve, the agent does the rest."
        actions={
          <>
            <Button variant="secondary" size="md">
              Configure rules
            </Button>
            <Button variant="ai" size="md">
              <Sparkles className="h-4 w-4" />
              AI triage now
            </Button>
          </>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          label="Open exceptions"
          value={counts.open + counts.inProg}
          note={`${counts.critical} critical · ${counts.inProg} in progress`}
          tone={counts.critical ? "danger" : "neutral"}
          icon={<AlertOctagon className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Auto-resolved · today"
          value={counts.auto}
          note="62% of routine exceptions"
          tone="accent"
          icon={<Bot className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Avg time-to-resolve"
          value="6m 42s"
          note="↓ 41% vs manual"
          tone="success"
          icon={<Clock className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Margin protected · today"
          value={`$${(counts.at_stake / 1000).toFixed(1)}K`}
          note={`${counts.open + counts.inProg} actions awaiting approval`}
          tone="success"
        />
      </section>

      {/* Hero / spotlight on the top critical exception */}
      {heroException && heroException.resolutions && heroException.resolutions.length > 0 && (
        <Card className="ai-edge overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            <div className="lg:col-span-2 p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-border-soft">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge tone="danger" dot size="sm">
                  Critical · top of queue
                </Badge>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.1em]">
                  <Sparkles className="h-3 w-3" /> AI ready
                </span>
                <span className="text-[11px] text-ink-muted">opened {heroException.age} ago</span>
              </div>
              <h2 className="font-display text-h2 text-ink-primary tracking-tight leading-tight">
                {heroException.title}
              </h2>
              <p className="mt-2 text-body text-ink-muted leading-relaxed max-w-xl">
                {heroException.detail}
              </p>
              <div className="mt-3 flex items-center flex-wrap gap-3 text-body-sm">
                <span className="text-ink-secondary">
                  Load <span className="font-mono text-ink-primary">{heroException.load}</span>
                </span>
                <span className="text-ink-disabled">·</span>
                <span className="text-ink-secondary">{heroException.driver}</span>
                {heroException.dollarImpact != null && (
                  <>
                    <span className="text-ink-disabled">·</span>
                    <span className="text-success-700 font-medium tabular-nums">
                      ${heroException.dollarImpact.toLocaleString()} at stake
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="p-5 lg:p-6 flex flex-col justify-between gap-4">
              <div>
                <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">
                  AI recommended action
                </p>
                <p className="mt-1 text-body font-medium text-ink-primary leading-snug">
                  {heroException.resolutions.find((r) => r.recommended)?.label}
                </p>
                <p className="mt-1 text-body-sm text-ink-muted leading-relaxed">
                  {heroException.resolutions.find((r) => r.recommended)?.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="ai" size="md" onClick={() => setActive(heroException)}>
                  <Sparkles className="h-4 w-4" />
                  Resolve now
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="md" onClick={() => setActive(heroException)}>
                  See all options
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filter bar */}
      <Card className="overflow-hidden">
        <div className="p-4 flex items-center gap-3 border-b border-border-soft flex-wrap">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search exceptions, loads, drivers, customers…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-full pl-9 pr-3 rounded-md border border-border-soft bg-subtle/40 text-body text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-surface transition-all"
            />
          </div>
          <FilterRow
            value={stateF}
            options={STATE_FILTERS}
            onChange={setStateF}
            counter={(k) => {
              if (k === "all") return EXCEPTIONS.length;
              if (k === "open") return EXCEPTIONS.filter((e) => e.state === "open" || e.state === "in_progress").length;
              return EXCEPTIONS.filter((e) => e.state === k).length;
            }}
          />
          <div className="ml-auto" />
          <FilterRow
            value={sevF}
            options={SEV_FILTERS}
            onChange={setSevF}
            counter={(k) =>
              k === "all" ? EXCEPTIONS.length : EXCEPTIONS.filter((e) => e.severity === k).length
            }
            tone="muted"
          />
        </div>

        <div className="p-3 flex items-center gap-2 border-b border-border-soft bg-subtle/30">
          <Sparkles className="h-3.5 w-3.5 text-accent-700" />
          <p className="text-body-sm text-ink-secondary">
            <span className="font-medium text-accent-700">AI ranked</span>{" "}
            <span className="font-medium text-ink-primary">{filtered.length}</span> exceptions by margin-at-stake.
          </p>
        </div>

        <div className="p-4 space-y-2">
          {filtered.length > 0 ? (
            filtered.map((e) => (
              <ExceptionItem
                key={e.id}
                exception={e}
                active={active?.id === e.id}
                onClick={() => setActive(e)}
              />
            ))
          ) : (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-success-500" strokeWidth={1.5} />
              <p className="mt-3 text-h3 text-ink-primary">All clear</p>
              <p className="mt-1 text-body-sm text-ink-muted">
                No exceptions match your filters. Your fleet is running clean.
              </p>
            </div>
          )}
        </div>
      </Card>

      <ExceptionDetailSheet
        exception={active}
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
      />
    </div>
  );
}

function FilterRow<T extends string>({
  value,
  options,
  onChange,
  counter,
  tone = "primary",
}: {
  value: T;
  options: readonly { key: T; label: string }[];
  onChange: (v: T) => void;
  counter: (k: T) => number;
  tone?: "primary" | "muted";
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {options.map((f) => {
        const isActive = value === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={cn(
              "h-8 px-3 rounded-md text-body-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap",
              isActive
                ? tone === "primary"
                  ? "bg-ink-primary text-ink-invert"
                  : "bg-subtle text-ink-primary border border-border"
                : "text-ink-secondary hover:bg-subtle hover:text-ink-primary"
            )}
          >
            {f.label}
            <span
              className={cn(
                "tabular-nums text-[11px] px-1.5 rounded",
                isActive && tone === "primary" ? "bg-white/15" : "bg-subtle text-ink-muted"
              )}
            >
              {counter(f.key)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
