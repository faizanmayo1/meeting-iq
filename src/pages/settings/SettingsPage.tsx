import { useState } from "react";
import {
  Building2,
  Plug,
  Users,
  Sparkles,
  Bell,
  CreditCard,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { WorkspaceSection } from "@/features/settings/WorkspaceSection";
import { IntegrationsSection } from "@/features/settings/IntegrationsSection";
import { MembersSection } from "@/features/settings/MembersSection";
import { AISection } from "@/features/settings/AISection";
import { NotificationsSection } from "@/features/settings/NotificationsSection";
import { BillingSection } from "@/features/settings/BillingSection";

const TABS = [
  { key: "workspace", label: "Workspace", group: "general", Icon: Building2 },
  { key: "integrations", label: "Integrations", group: "general", Icon: Plug },
  { key: "members", label: "Members & roles", group: "general", Icon: Users },
  { key: "ai", label: "AI & Automation", group: "intelligence", Icon: Sparkles },
  { key: "notifications", label: "Notifications", group: "intelligence", Icon: Bell },
  { key: "billing", label: "Billing & plan", group: "account", Icon: CreditCard },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function SettingsPage() {
  const [active, setActive] = useState<TabKey>("workspace");

  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1200px] mx-auto space-y-6 reveal-stack">
      <PageHeader
        title="Settings"
        subtitle="Configure your workspace, integrations, members, AI thresholds, and billing."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
        {/* Vertical tabs */}
        <Card className="p-2 h-fit lg:sticky lg:top-4">
          <SectionLabel>General</SectionLabel>
          <ul className="flex flex-col gap-0.5 mb-2">
            {TABS.filter((t) => t.group === "general").map((t) => (
              <TabItem key={t.key} t={t} active={active === t.key} onClick={() => setActive(t.key)} />
            ))}
          </ul>
          <SectionLabel>Intelligence</SectionLabel>
          <ul className="flex flex-col gap-0.5 mb-2">
            {TABS.filter((t) => t.group === "intelligence").map((t) => (
              <TabItem key={t.key} t={t} active={active === t.key} onClick={() => setActive(t.key)} />
            ))}
          </ul>
          <SectionLabel>Account</SectionLabel>
          <ul className="flex flex-col gap-0.5">
            {TABS.filter((t) => t.group === "account").map((t) => (
              <TabItem key={t.key} t={t} active={active === t.key} onClick={() => setActive(t.key)} />
            ))}
          </ul>

          {/* Trust footer */}
          <div className="mt-4 pt-3 border-t border-border-soft px-2 pb-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
              <ShieldCheck className="h-3 w-3 text-success-500" />
              SOC 2 · Audit logged
            </div>
          </div>
        </Card>

        {/* Panel */}
        <div className="min-w-0 space-y-5">
          {active === "workspace" && <WorkspaceSection />}
          {active === "integrations" && <IntegrationsSection />}
          {active === "members" && <MembersSection />}
          {active === "ai" && <AISection />}
          {active === "notifications" && <NotificationsSection />}
          {active === "billing" && <BillingSection />}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 pt-2 pb-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-ink-muted">
      {children}
    </div>
  );
}

function TabItem({
  t,
  active,
  onClick,
}: {
  t: (typeof TABS)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "group relative w-full flex items-center gap-2.5 rounded-md pl-3 pr-2 py-1.5 text-body transition-colors",
          "text-ink-secondary hover:bg-subtle hover:text-ink-primary",
          active && "bg-brand-50 text-brand-700 font-medium hover:bg-brand-50"
        )}
      >
        {active && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r bg-brand-500" />
        )}
        <t.Icon
          className={cn("h-4 w-4 shrink-0", active && "text-brand-600")}
          strokeWidth={1.75}
        />
        <span className="flex-1 truncate text-left">{t.label}</span>
        {active && <ChevronRight className="h-3 w-3 text-brand-500" />}
      </button>
    </li>
  );
}
