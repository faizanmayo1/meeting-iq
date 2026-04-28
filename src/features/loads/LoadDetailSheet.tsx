import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/data-display/StatusBadge";
import { LoadTimeline } from "./LoadTimeline";
import type { LoadRow } from "@/mocks/seed/loads";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Truck,
  User,
  Building2,
  Weight,
  Route,
  DollarSign,
  ArrowRight,
  Phone,
  Check,
  Clock,
} from "lucide-react";

type Props = {
  load: LoadRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LoadDetailSheet({ load, open, onOpenChange }: Props) {
  const [selectedRec, setSelectedRec] = useState<string | null>(null);
  if (!load) return null;
  const recs = load.recommendations ?? [];
  const preferred = recs.find((r) => r.preferred);
  const activeRec = recs.find((r) => r.id === selectedRec) ?? preferred ?? recs[0];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" width="sm:max-w-[640px]" className="flex flex-col p-0">
        <SheetHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-body-sm text-ink-muted">{load.id}</span>
            <span className="text-ink-disabled">·</span>
            <StatusBadge status={load.status} />
            {load.predictedDelay && (
              <span className="inline-flex items-center gap-1 text-warning-700 font-medium text-body-sm tabular-nums">
                <Clock className="h-3.5 w-3.5" /> {load.predictedDelay}
              </span>
            )}
          </div>
          <SheetTitle className="!text-h2 leading-tight pr-8">
            {load.origin}
            <span className="text-ink-muted font-normal mx-2">→</span>
            {load.dest}
          </SheetTitle>
          <p className="text-body-sm text-ink-muted">
            {load.miles.toLocaleString()} mi · {load.equipment} · {load.weight}
          </p>
        </SheetHeader>

        <SheetBody className="flex-1 space-y-6">
          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-2">
            <Fact icon={<User className="h-3.5 w-3.5" />} label="Driver" value={load.driver} sub={load.unit} />
            <Fact icon={<Truck className="h-3.5 w-3.5" />} label="Equipment" value={load.equipment} sub={load.weight} />
            <Fact icon={<Building2 className="h-3.5 w-3.5" />} label="Customer" value={load.customer} />
            <Fact
              icon={<DollarSign className="h-3.5 w-3.5" />}
              label="Revenue"
              value={`$${(load.revenue / 1000).toFixed(1)}K`}
              sub={`$${(load.revenue / load.miles).toFixed(2)} / mi`}
            />
          </div>

          {/* AI Recommendation panel */}
          {recs.length > 0 && (
            <section className="ai-edge rounded-xl bg-surface p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-medium uppercase tracking-[0.1em]">
                    <Sparkles className="h-3 w-3" /> AI Recommendation
                  </span>
                  <span className="text-body-sm text-ink-muted">3 options · ranked by margin</span>
                </div>
              </div>
              <div className="space-y-2">
                {recs.map((rec, i) => {
                  const active = (activeRec?.id ?? null) === rec.id;
                  const positive = rec.impact > 0;
                  return (
                    <button
                      key={rec.id}
                      onClick={() => setSelectedRec(rec.id)}
                      className={cn(
                        "w-full text-left rounded-lg border p-3 transition-all",
                        active
                          ? "border-brand-500 bg-brand-50/50 ring-1 ring-brand-500/20"
                          : "border-border-soft bg-surface hover:border-border"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className="h-6 w-6 shrink-0 rounded-md bg-subtle text-ink-muted grid place-items-center text-[11px] font-mono">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-body font-medium text-ink-primary">{rec.label}</h4>
                            {rec.preferred && (
                              <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-accent-700 bg-accent-50 px-1.5 py-0.5 rounded">
                                Preferred
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-body-sm text-ink-muted leading-relaxed">{rec.description}</p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px]">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium tabular-nums",
                                positive ? "text-success-700 bg-success-50" : "text-danger-700 bg-danger-50"
                              )}
                            >
                              <DollarSign className="h-3 w-3" />
                              {positive ? "+" : ""}
                              ${Math.abs(rec.impact)}
                            </span>
                            {rec.saveMinutes != null && rec.saveMinutes > 0 && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-ink-secondary bg-subtle font-medium tabular-nums">
                                <Clock className="h-3 w-3" />
                                {rec.saveMinutes}m saved
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className={cn(
                            "h-4 w-4 rounded-full border-2 grid place-items-center shrink-0",
                            active ? "border-brand-500 bg-brand-500" : "border-border-strong"
                          )}
                        >
                          {active && <Check className="h-2.5 w-2.5 text-ink-invert" strokeWidth={3} />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Timeline */}
          {load.timeline && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-caption uppercase tracking-[0.1em] text-ink-muted flex items-center gap-1.5">
                  <Route className="h-3.5 w-3.5" /> Route timeline
                </h3>
                <span className="text-body-sm text-ink-muted">
                  {load.timeline.filter((t) => t.status === "completed").length} of {load.timeline.length} stops
                </span>
              </div>
              <LoadTimeline stops={load.timeline} />
            </section>
          )}

          {/* Customer / driver bar */}
          <section className="rounded-lg bg-subtle/60 border border-border-soft p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[11px] font-semibold">
                {load.driver.split(" ").map((p) => p[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-body-sm font-medium text-ink-primary">{load.driver}</p>
                <p className="text-[11px] text-ink-muted">Unit {load.unit} · 4.9 score · 2.1 yrs</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              <Phone className="h-3.5 w-3.5" />
              Contact
            </Button>
          </section>
        </SheetBody>

        <SheetFooter>
          <Button variant="ghost" size="md" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="secondary" size="md">
            <Weight className="h-4 w-4" />
            Open in TMS
          </Button>
          {recs.length > 0 && (
            <Button variant="ai" size="md" disabled={!activeRec}>
              <Sparkles className="h-4 w-4" />
              Execute &amp; notify customer
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Fact({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg bg-subtle/60 border border-border-soft p-3">
      <div className="flex items-center gap-1.5 text-ink-muted text-caption uppercase tracking-[0.1em]">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-body font-medium text-ink-primary truncate">{value}</p>
      {sub && <p className="text-[11px] text-ink-muted mt-0.5 truncate">{sub}</p>}
    </div>
  );
}
