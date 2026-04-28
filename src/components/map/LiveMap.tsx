import { useState } from "react";
import type { Truck } from "@/mocks/seed/trucks";
import { cn } from "@/lib/utils";

const TRUCK_COLOR: Record<Truck["status"], string> = {
  moving: "fill-success-500",
  idle: "fill-warning-500",
  maintenance: "fill-danger-500",
  offline: "fill-ink-disabled",
};

type Props = { trucks: Truck[]; height?: number };

export function LiveMap({ trucks, height = 360 }: Props) {
  const [hover, setHover] = useState<Truck | null>(null);
  const moving = trucks.filter((t) => t.status === "moving").length;
  const atRisk = trucks.filter((t) => t.status === "idle" || t.status === "maintenance").length;

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-br from-[#F4F6FB] to-[#E9EDF7] border border-border-soft" style={{ height }}>
      {/* Grid backdrop — infrastructure feel */}
      <div className="absolute inset-0 bg-grid-soft bg-grid-soft opacity-60" />
      {/* Subtle continent abstraction — not a real map but reads as one */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--brand-100) / 0.6)" />
            <stop offset="100%" stopColor="hsl(var(--brand-50) / 0.3)" />
          </linearGradient>
          <radialGradient id="disrupt" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--warning-500) / 0.35)" />
            <stop offset="100%" stopColor="hsl(var(--warning-500) / 0)" />
          </radialGradient>
        </defs>
        {/* abstract continental landmass */}
        <path
          d="M5,50 Q10,30 25,28 Q40,18 55,22 Q70,15 80,22 Q92,28 92,42 Q95,56 88,68 Q80,82 60,82 Q40,86 28,78 Q12,72 8,62 Q2,55 5,50 Z"
          fill="url(#land)"
          stroke="hsl(var(--border-default) / 0.4)"
          strokeWidth="0.2"
          vectorEffect="non-scaling-stroke"
        />
        {/* lane: ATL → MEM */}
        <path
          d="M64,38 Q60,40 56,42"
          stroke="hsl(var(--brand-500))"
          strokeWidth="0.4"
          vectorEffect="non-scaling-stroke"
          fill="none"
          strokeDasharray="0.8 0.6"
        />
        {/* lane: LAX → PHX */}
        <path
          d="M18,62 Q22,60 28,58"
          stroke="hsl(var(--brand-500))"
          strokeWidth="0.4"
          vectorEffect="non-scaling-stroke"
          fill="none"
          strokeDasharray="0.8 0.6"
        />
        {/* lane: DFW → HOU */}
        <path
          d="M47,70 Q49,75 50,80"
          stroke="hsl(var(--brand-500))"
          strokeWidth="0.4"
          vectorEffect="non-scaling-stroke"
          fill="none"
          strokeDasharray="0.8 0.6"
        />
        {/* disruption halos */}
        <circle cx="60" cy="40" r="10" fill="url(#disrupt)" />
        <circle cx="60" cy="40" r="3.5" fill="none" stroke="hsl(var(--warning-500) / 0.45)" strokeWidth="0.2" strokeDasharray="0.6 0.4" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Truck markers */}
      <div className="absolute inset-0">
        {trucks.map((t) => (
          <button
            key={t.id}
            onMouseEnter={() => setHover(t)}
            onMouseLeave={() => setHover(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${t.x}%`, top: `${t.y}%` }}
            aria-label={`Unit ${t.unit}`}
          >
            <span className={cn("absolute inset-0 rounded-full opacity-30", TRUCK_COLOR[t.status], "animate-ping-soft")} style={{ animationDuration: t.status === "moving" ? "2.4s" : undefined, display: t.status === "moving" ? "block" : "none" }} />
            <svg width="14" height="14" viewBox="0 0 14 14" className={cn("relative drop-shadow-sm transition-transform group-hover:scale-125", TRUCK_COLOR[t.status])}>
              <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5" />
            </svg>
          </button>
        ))}
      </div>

      {/* Hover tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-md bg-ink-primary text-ink-invert shadow-elev-2 text-body-sm whitespace-nowrap"
          style={{ left: `${hover.x}%`, top: `calc(${hover.y}% - 12px)` }}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] opacity-80">{hover.unit}</span>
            <span className="opacity-50">·</span>
            <span>{hover.driver}</span>
          </div>
          {hover.load && <div className="text-[11px] opacity-70 font-mono">{hover.load}</div>}
        </div>
      )}

      {/* Stat overlay (top-left) */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 text-[11px]">
        <Stat dot="bg-success-500" label="Moving" count={moving} />
        <Stat dot="bg-warning-500" label="At risk" count={atRisk} />
        <Stat dot="bg-danger-500" label="Disruption zones" count={1} />
      </div>

      {/* Legend (bottom-right) */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 px-2 py-1 rounded-md bg-surface/80 backdrop-blur border border-border-soft text-[11px] text-ink-muted">
        <span className="font-mono">live</span>
        <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" />
      </div>
    </div>
  );
}

function Stat({ dot, label, count }: { dot: string; label: string; count: number }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface/85 backdrop-blur border border-border-soft">
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      <span className="text-ink-secondary font-medium">{count}</span>
      <span className="text-ink-muted">{label}</span>
    </div>
  );
}
