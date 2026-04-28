import { useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, GitMerge, Lock, CircleDashed } from "lucide-react";
import type { Decision } from "@/mocks/seed/decisions";
import { DECISIONS } from "@/mocks/seed/decisions";
import { cn } from "@/lib/utils";

/**
 * Custom SVG decision-graph. Each node is a hand-positioned point in a 1000x600
 * viewBox so layout reads as deliberate. Edges:
 *  - "depends" — solid magenta arrow
 *  - "conflict" — dashed red, animated
 */

type EdgeKind = "depends" | "conflict";

type Edge = {
  from: string;        // decision id
  to: string;          // decision id
  kind: EdgeKind;
  label?: string;
};

type Position = { x: number; y: number };

/** Hand-positioned for the demo to read coherent. Hero decision is center. */
const POSITIONS: Record<string, Position> = {
  "d-rollout-phased":     { x: 500, y: 300 },   // hero: center
  "d-sales-aug14-commit": { x: 220, y: 220 },   // conflict, top-left
  "d-auth-migration":     { x: 820, y: 200 },   // dependency, top-right
  "d-q3-themes":          { x: 820, y: 400 },   // dependency-of-dependency
  "d-hiring-q3":          { x: 200, y: 460 },   // bottom-left
  "d-tier3-sla":          { x: 380, y: 480 },   // bottom-mid
  "d-vendor-y":           { x: 660, y: 470 },   // bottom-mid-right
  "d-pause-feature-x":    { x: 880, y: 540 },   // bottom-right
};

/** Edges derived from decision dependencies + conflicts. */
const EDGES: Edge[] = [
  { from: "d-rollout-phased", to: "d-sales-aug14-commit", kind: "conflict", label: "Conflict" },
  { from: "d-rollout-phased", to: "d-auth-migration", kind: "depends", label: "Gates wave 1" },
  { from: "d-q3-themes", to: "d-auth-migration", kind: "depends" },
  { from: "d-pause-feature-x", to: "d-q3-themes", kind: "depends", label: "Frees engineers" },
];

const STATUS_STYLE: Record<
  Decision["status"],
  {
    Icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }>;
    pillTone: string;
    nodeRing: string;
    statusLabel: string;
  }
> = {
  decided: {
    Icon: CheckCircle2,
    pillTone: "bg-success-50 text-success-700 ring-success-500/20",
    nodeRing: "stroke-success-500/40",
    statusLabel: "Decided",
  },
  open: {
    Icon: CircleDashed,
    pillTone: "bg-brand-50 text-brand-700 ring-brand-500/20",
    nodeRing: "stroke-brand-500/40",
    statusLabel: "Open",
  },
  blocked: {
    Icon: Lock,
    pillTone: "bg-danger-50 text-danger-700 ring-danger-500/20",
    nodeRing: "stroke-danger-500/40",
    statusLabel: "Blocked",
  },
  conflict: {
    Icon: AlertTriangle,
    pillTone: "bg-danger-50 text-danger-700 ring-danger-500/20",
    nodeRing: "stroke-danger-500/40",
    statusLabel: "In conflict",
  },
};

const VIEWBOX_W = 1000;
const VIEWBOX_H = 600;

export function DecisionGraph({ onSelect }: { onSelect?: (d: Decision) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const nodes = useMemo(
    () =>
      DECISIONS.filter((d) => POSITIONS[d.id]).map((d) => ({
        ...d,
        pos: POSITIONS[d.id],
      })),
    []
  );

  const edgeFor = (e: Edge) => {
    const a = POSITIONS[e.from];
    const b = POSITIONS[e.to];
    if (!a || !b) return null;
    // Quadratic bezier with subtle curve — readable, not jagged
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    // perpendicular offset so curves don't overlap
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const offset = 30;
    const cx = mx - (dy / len) * offset;
    const cy = my + (dx / len) * offset;
    return { d: `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`, ax: a.x, ay: a.y, bx: b.x, by: b.y };
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-br from-[#FBF5FA] to-[#F4EEF7] border border-border-soft">
      {/* Soft grid */}
      <div className="absolute inset-0 bg-grid-soft bg-grid-soft opacity-60 pointer-events-none" />

      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        className="block w-full h-auto"
        style={{ aspectRatio: `${VIEWBOX_W} / ${VIEWBOX_H}` }}
      >
        <defs>
          <marker
            id="arrow-depends"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--brand-500))" />
          </marker>
          <marker
            id="arrow-conflict"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--danger-500))" />
          </marker>
        </defs>

        {/* Edges */}
        <g>
          {EDGES.map((e, i) => {
            const path = edgeFor(e);
            if (!path) return null;
            const isConflict = e.kind === "conflict";
            return (
              <g key={i}>
                <path
                  d={path.d}
                  fill="none"
                  stroke={isConflict ? "hsl(var(--danger-500))" : "hsl(var(--brand-500))"}
                  strokeWidth={2}
                  strokeDasharray={isConflict ? "6 6" : undefined}
                  markerEnd={isConflict ? "url(#arrow-conflict)" : "url(#arrow-depends)"}
                  opacity={
                    hovered && hovered !== e.from && hovered !== e.to ? 0.18 : isConflict ? 0.85 : 0.7
                  }
                  className={isConflict ? "animate-[pulse_2.4s_ease-in-out_infinite]" : undefined}
                />
                {e.label && (
                  <g
                    transform={`translate(${(path.ax + path.bx) / 2}, ${(path.ay + path.by) / 2 - 8})`}
                  >
                    <rect
                      x={-(e.label.length * 3.2 + 8)}
                      y={-8}
                      width={e.label.length * 6.4 + 16}
                      height={16}
                      rx={4}
                      fill="hsl(var(--surface))"
                      stroke="hsl(var(--border-soft))"
                    />
                    <text
                      x={0}
                      y={3}
                      textAnchor="middle"
                      fontSize="10"
                      fontFamily="JetBrains Mono, monospace"
                      fill={isConflict ? "hsl(var(--danger-700))" : "hsl(var(--brand-700))"}
                      fontWeight={500}
                    >
                      {e.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((n) => {
            const style = STATUS_STYLE[n.status];
            const isHero = n.id === "d-rollout-phased";
            const w = isHero ? 240 : 200;
            const h = isHero ? 88 : 76;
            return (
              <g
                key={n.id}
                transform={`translate(${n.pos.x - w / 2}, ${n.pos.y - h / 2})`}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect?.(n)}
                className="cursor-pointer transition-transform"
                style={{
                  transformOrigin: `${w / 2}px ${h / 2}px`,
                  transform:
                    hovered === n.id
                      ? `translate(${n.pos.x - w / 2}px, ${n.pos.y - h / 2}px) scale(1.04)`
                      : `translate(${n.pos.x - w / 2}px, ${n.pos.y - h / 2}px)`,
                }}
              >
                {/* Glow / ring for hero */}
                {isHero && (
                  <rect
                    x={-6}
                    y={-6}
                    width={w + 12}
                    height={h + 12}
                    rx={14}
                    fill="none"
                    stroke="url(#hero-glow)"
                    strokeWidth={1.5}
                    opacity={0.35}
                  />
                )}
                <rect
                  width={w}
                  height={h}
                  rx={10}
                  fill="hsl(var(--surface))"
                  stroke={
                    hovered === n.id
                      ? "hsl(var(--brand-500))"
                      : isHero
                      ? "hsl(var(--brand-500) / 0.5)"
                      : "hsl(var(--border-default))"
                  }
                  strokeWidth={hovered === n.id || isHero ? 2 : 1}
                  className="transition-all"
                />
                {/* Status indicator strip */}
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={h}
                  rx={2}
                  fill={
                    n.status === "decided"
                      ? "hsl(var(--success-500))"
                      : n.status === "blocked" || n.status === "conflict"
                      ? "hsl(var(--danger-500))"
                      : "hsl(var(--brand-500))"
                  }
                />
                {/* Title */}
                <foreignObject x={12} y={10} width={w - 20} height={h - 20}>
                  <div className="text-ink-primary leading-tight" style={{ fontFamily: "InterVariable, Inter, sans-serif" }}>
                    <div className="flex items-center gap-1 mb-1">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-[0.08em] ring-1 ring-inset",
                          style.pillTone
                        )}
                      >
                        <style.Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
                        {style.statusLabel}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "font-medium text-ink-primary line-clamp-2",
                        isHero ? "text-[12.5px]" : "text-[11px]"
                      )}
                      style={{ lineHeight: 1.3 }}
                    >
                      {n.title}
                    </p>
                    <p className="text-[9.5px] text-ink-muted mt-1 truncate">
                      {n.departments.slice(0, 3).join(" · ")}
                    </p>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </g>

        <defs>
          <linearGradient id="hero-glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--brand-500))" />
            <stop offset="100%" stopColor="hsl(var(--accent-500))" />
          </linearGradient>
        </defs>
      </svg>

      {/* Legend (overlay) */}
      <div className="absolute bottom-3 right-3 px-3 py-2 rounded-md bg-surface/85 backdrop-blur border border-border-soft text-[11px] text-ink-secondary space-y-1.5">
        <div className="text-[9px] font-semibold uppercase tracking-[0.1em] text-ink-muted mb-1">
          Edge legend
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-px bg-brand-500" />
          <span>Dependency</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-px border-t border-dashed border-danger-500" />
          <span>Conflict · alignment risk</span>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-3 left-3 px-3 py-2 rounded-md bg-surface/85 backdrop-blur border border-border-soft">
        <p className="text-[9px] uppercase tracking-[0.12em] text-ink-muted font-semibold">Decision graph</p>
        <p className="text-[12px] text-ink-primary font-medium tabular-nums">
          {nodes.length} decisions ·{" "}
          <span className="text-danger-700">
            {EDGES.filter((e) => e.kind === "conflict").length} conflict
          </span>
          {" · "}
          <span className="text-brand-700">
            {EDGES.filter((e) => e.kind === "depends").length} dep
          </span>
        </p>
      </div>
    </div>
  );
}
