import { useState } from "react";
import {
  AlertTriangle,
  Plug,
  Plus,
  Search,
  CalendarDays,
  Video,
  MessageSquare,
  Building2,
  ListChecks,
  FileText,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SettingsSection } from "./_shared";
import { INTEGRATIONS, type Integration } from "@/mocks/seed/integrations";
import { cn } from "@/lib/utils";

const CATEGORY_ICON: Record<Integration["category"], React.ComponentType<{ className?: string; strokeWidth?: number | string }>> = {
  Calendar: CalendarDays,
  Video: Video,
  Comms: MessageSquare,
  CRM: Building2,
  "Project Mgmt": ListChecks,
  Docs: FileText,
  BI: BarChart3,
};

const STATUS_TONE = {
  connected: "success",
  disconnected: "neutral",
  error: "danger",
} as const;

const STATUS_LABEL = {
  connected: "Connected",
  disconnected: "Not connected",
  error: "Sync error",
} as const;

export function IntegrationsSection() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Integration["status"]>("all");

  const filtered = INTEGRATIONS.filter((i) => {
    if (filter !== "all" && i.status !== filter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      i.name.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    );
  });

  const counts = {
    all: INTEGRATIONS.length,
    connected: INTEGRATIONS.filter((i) => i.status === "connected").length,
    disconnected: INTEGRATIONS.filter((i) => i.status === "disconnected").length,
    error: INTEGRATIONS.filter((i) => i.status === "error").length,
  };

  return (
    <SettingsSection
      caption="Integrations"
      title={`${counts.connected} of ${counts.all} sources connected`}
      description="FreightIQ pulls from your existing TMS, ELD, fuel cards, EDI provider, and comms tools. Nothing replaced — everything unified."
      actions={
        <Button variant="primary" size="md">
          <Plus className="h-4 w-4" />
          Add integration
        </Button>
      }
    >
      <div className="px-5 pb-3 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <Input
            placeholder="Search integrations…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-subtle/40 border-border-soft"
          />
        </div>
        <div className="flex items-center gap-1">
          {(
            [
              { key: "all", label: "All" },
              { key: "connected", label: "Connected" },
              { key: "disconnected", label: "Available" },
              { key: "error", label: "Errors" },
            ] as const
          ).map((f) => {
            const isActive = filter === f.key;
            const c = counts[f.key as keyof typeof counts];
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
                  {c}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 pt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((i) => {
          const Icon = CATEGORY_ICON[i.category];
          return (
            <div
              key={i.id}
              className={cn(
                "rounded-xl border bg-surface p-4 flex flex-col gap-3 transition-colors",
                i.status === "error"
                  ? "border-danger-500/25 hover:border-danger-500/40"
                  : "border-border-soft hover:border-border"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span
                    className={cn(
                      "h-9 w-9 shrink-0 rounded-md grid place-items-center",
                      i.status === "connected"
                        ? "bg-brand-50 text-brand-700"
                        : i.status === "error"
                        ? "bg-danger-50 text-danger-700"
                        : "bg-subtle text-ink-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-body font-medium text-ink-primary truncate">{i.name}</h4>
                      <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-ink-muted bg-subtle px-1.5 py-0.5 rounded">
                        {i.category}
                      </span>
                    </div>
                    <Badge tone={STATUS_TONE[i.status]} size="sm" dot className="mt-1">
                      {STATUS_LABEL[i.status]}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-body-sm text-ink-muted leading-snug">{i.description}</p>

              {(i.status === "connected" || i.status === "error") && (
                <div className="pt-3 border-t border-border-soft flex items-center justify-between gap-3 text-[11px]">
                  <div className="text-ink-muted truncate">
                    {i.account ? (
                      <>
                        Account <span className="font-mono text-ink-secondary">{i.account}</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-ink-muted shrink-0">
                    {i.status === "error" && <AlertTriangle className="h-3 w-3 text-danger-500" />}
                    Last sync · {i.lastSync}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 -mb-1">
                {i.status === "connected" ? (
                  <>
                    <Button variant="secondary" size="sm">Configure</Button>
                    <Button variant="ghost" size="sm">Test sync</Button>
                  </>
                ) : i.status === "error" ? (
                  <>
                    <Button variant="danger" size="sm">Re-authenticate</Button>
                    <Button variant="ghost" size="sm">View errors</Button>
                  </>
                ) : (
                  <Button variant="primary" size="sm">
                    <Plug className="h-3.5 w-3.5" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SettingsSection>
  );
}
