import { Bell, Command, Search, Sparkles } from "lucide-react";

export function Topbar({ onCopilotOpen }: { onCopilotOpen?: () => void }) {
  return (
    <header className="h-14 shrink-0 border-b border-border-soft bg-surface/70 backdrop-blur-xl sticky top-0 z-30">
      <div className="h-full pl-5 pr-4 flex items-center gap-4">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search loads, drivers, units, lanes…"
            className="h-9 w-full pl-9 pr-16 rounded-md border border-transparent bg-subtle/70 text-body text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/40 focus:bg-surface transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 rounded border border-border-soft bg-surface px-1.5 py-0.5 text-[10px] font-mono text-ink-muted">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={onCopilotOpen}
            className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-body-sm font-medium text-accent-700 bg-accent-50/80 hover:bg-accent-50 border border-accent-500/15 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            Ask Copilot
            <kbd className="ml-1 inline-flex items-center rounded border border-accent-500/20 bg-surface px-1 py-0 text-[10px] font-mono text-accent-700">
              ⌘J
            </kbd>
          </button>

          <button
            className="relative h-9 w-9 grid place-items-center rounded-md text-ink-muted hover:text-ink-primary hover:bg-subtle transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-danger-500 ring-2 ring-surface" />
          </button>

          <div className="ml-1.5 flex items-center gap-2.5 pl-3 border-l border-border-soft h-9">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 text-ink-invert grid place-items-center text-[11px] font-semibold">
                ST
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success-500 ring-2 ring-surface" />
            </div>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-body-sm font-medium text-ink-primary">Stefan Trifan</span>
              <span className="text-[11px] text-ink-muted">Chief Operating Officer</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
