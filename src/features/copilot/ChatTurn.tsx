import { Sparkles, ThumbsDown, ThumbsUp, Copy, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatTurn } from "@/mocks/seed/copilot";
import { LaneChartBlock, HOSListBlock } from "./ChatBlocks";

function renderInline(text: string) {
  // very small subset: **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-ink-primary">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

export function ChatTurnView({ turn, onSuggest }: { turn: ChatTurn; onSuggest?: (s: string) => void }) {
  if (turn.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] rounded-2xl rounded-br-sm bg-ink-primary text-ink-invert px-4 py-2.5 text-body shadow-elev-1">
          {turn.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3 max-w-[88%]">
      <div className="h-8 w-8 shrink-0 rounded-md bg-gradient-to-br from-brand-500 to-accent-500 grid place-items-center text-ink-invert shadow-elev-1">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2.25} />
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        <div className="ai-edge rounded-2xl rounded-tl-sm bg-surface p-4 shadow-elev-1">
          <p className="text-body text-ink-secondary leading-relaxed">{renderInline(turn.text)}</p>
        </div>

        {turn.block?.kind === "lane-chart" && <LaneChartBlock data={turn.block.data} />}
        {turn.block?.kind === "hos-list" && <HOSListBlock drivers={turn.block.drivers} />}

        {/* Action footer */}
        <div className="flex items-center gap-2">
          <button className="h-7 w-7 grid place-items-center rounded-md text-ink-muted hover:bg-subtle hover:text-ink-primary transition-colors">
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button className="h-7 w-7 grid place-items-center rounded-md text-ink-muted hover:bg-subtle hover:text-ink-primary transition-colors">
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
          <button className="h-7 px-2 rounded-md inline-flex items-center gap-1 text-[11px] text-ink-muted hover:bg-subtle hover:text-ink-primary transition-colors">
            <Copy className="h-3 w-3" /> Copy
          </button>
          <span className="text-[11px] text-ink-muted">· generated 4s ago · 1.2s</span>
        </div>

        {/* Followups */}
        {turn.followups && turn.followups.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {turn.followups.map((f) => (
              <button
                key={f}
                onClick={() => onSuggest?.(f)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-body-sm",
                  "bg-accent-50/60 text-accent-700 border border-accent-500/20 hover:bg-accent-50 transition-colors"
                )}
              >
                <ArrowRight className="h-3 w-3" />
                {f}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
