import { Sparkles, ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/data-display/StatusBadge";
import type { LoadRow } from "@/mocks/seed/loads";
import { cn } from "@/lib/utils";

const ORIGIN_CODE: Record<string, string> = {
  "Atlanta, GA": "ATL",
  "Memphis, TN": "MEM",
  "Los Angeles, CA": "LAX",
  "Phoenix, AZ": "PHX",
  "Dallas, TX": "DFW",
  "Houston, TX": "HOU",
  "Seattle, WA": "SEA",
  "Portland, OR": "PDX",
  "Chicago, IL": "ORD",
  "Detroit, MI": "DTW",
  "Miami, FL": "MIA",
  "Jacksonville, FL": "JAX",
  "Denver, CO": "DEN",
  "Salt Lake City, UT": "SLC",
  "Boston, MA": "BOS",
  "Albany, NY": "ALB",
  "Philadelphia, PA": "PHL",
  "Baltimore, MD": "BWI",
  "Charlotte, NC": "CLT",
  "Oklahoma City, OK": "OKC",
  "Las Vegas, NV": "LAS",
};

const code = (s: string) => ORIGIN_CODE[s] ?? s.slice(0, 3).toUpperCase();

type Props = {
  loads: LoadRow[];
  onOpen: (l: LoadRow) => void;
};

export function LoadsTable({ loads, onOpen }: Props) {
  return (
    <div className="overflow-hidden">
      <table className="w-full text-body">
        <thead className="border-b border-border-soft bg-surface">
          <tr className="text-left text-caption uppercase text-ink-muted tracking-[0.08em]">
            <Th>Load · customer</Th>
            <Th>Lane</Th>
            <Th>Driver / Unit</Th>
            <Th>Equipment</Th>
            <Th>Status</Th>
            <Th align="right">ETA</Th>
            <Th align="right">Revenue</Th>
            <Th align="right">Action</Th>
          </tr>
        </thead>
        <tbody>
          {loads.map((l) => (
            <tr
              key={l.id}
              onClick={() => onOpen(l)}
              className="border-b border-border-soft last:border-b-0 cursor-pointer transition-colors group hover:bg-subtle/50"
            >
              <td className="px-5 py-3.5">
                <div className="font-mono text-[13px] text-ink-primary">{l.id}</div>
                <div className="text-[11px] text-ink-muted mt-0.5">{l.customer}</div>
              </td>
              <td className="px-3 py-3.5">
                <div className="text-body-sm text-ink-primary">
                  <span className="font-medium">{code(l.origin)}</span>
                  <span className="mx-1.5 text-ink-disabled">→</span>
                  <span className="font-medium">{code(l.dest)}</span>
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5 tabular-nums">
                  {l.miles.toLocaleString()} mi
                </div>
              </td>
              <td className="px-3 py-3.5">
                <div className="text-body-sm text-ink-primary">{l.driver}</div>
                <div className="text-[11px] font-mono text-ink-muted mt-0.5">{l.unit}</div>
              </td>
              <td className="px-3 py-3.5 text-body-sm text-ink-secondary">
                {l.equipment}
              </td>
              <td className="px-3 py-3.5">
                <StatusBadge status={l.status} />
              </td>
              <td className="px-3 py-3.5 text-right">
                {l.predictedDelay ? (
                  <span
                    className={cn(
                      "font-mono text-body-sm tabular-nums font-medium",
                      l.status === "delayed" ? "text-danger-700" : "text-warning-700"
                    )}
                  >
                    {l.predictedDelay}
                  </span>
                ) : l.status === "scheduled" ? (
                  <span className="text-body-sm text-ink-muted">scheduled</span>
                ) : l.status === "delivered" ? (
                  <span className="text-body-sm text-success-700">delivered</span>
                ) : (
                  <span className="text-body-sm text-success-700">on time</span>
                )}
              </td>
              <td className="px-3 py-3.5 text-right font-mono text-body-sm tabular-nums text-ink-primary">
                ${(l.revenue / 1000).toFixed(1)}K
              </td>
              <td className="px-5 py-3.5 text-right">
                {l.recommendations?.length ? (
                  <span className="inline-flex items-center gap-1 text-body-sm font-medium text-accent-700 px-2 py-1 rounded-md bg-accent-50">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI rec
                  </span>
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-body-sm text-ink-muted">
                    Open
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className={cn(
        "font-medium px-3 py-2.5 first:pl-5 last:pr-5",
        align === "right" && "text-right"
      )}
    >
      {children}
    </th>
  );
}
