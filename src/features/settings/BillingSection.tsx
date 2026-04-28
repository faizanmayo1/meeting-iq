import { Sparkles, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SettingsSection } from "./_shared";

export function BillingSection() {
  return (
    <div className="space-y-5">
      <SettingsSection caption="Plan" title="MeetingIQ Enterprise">
        <div className="px-5 pb-5">
          <div className="ai-edge rounded-xl bg-surface p-5 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 items-start">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge tone="accent" size="sm" dot>Enterprise</Badge>
                <span className="text-[11px] text-ink-muted">Renews Apr 28, 2027</span>
              </div>
              <h3 className="mt-2 font-display text-h2 text-ink-primary tracking-tight leading-tight">
                $84,000 / year
              </h3>
              <p className="mt-1 text-body text-ink-muted">
                Up to 200 seats · unlimited meetings · all integrations · 7-yr audit retention.
              </p>
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {[
                  "All AI capabilities live",
                  "Dedicated success engineer",
                  "SOC 2 Type II reports",
                  "SAML SSO + SCIM",
                  "Priority CRM / Project-tool integrations",
                  "99.95% uptime SLA",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-body-sm text-ink-secondary">
                    <Check className="h-3.5 w-3.5 text-success-500" strokeWidth={2.25} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button variant="ai" size="md">
                <Sparkles className="h-4 w-4" />
                Talk to your CSM
              </Button>
              <Button variant="ghost" size="md">View contract</Button>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection caption="Usage · this billing period" title="142 of 200 units">
        <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <UsageBar label="Active seats" used={92} total={200} suffix=" seats" />
          <UsageBar label="Meetings processed" used={1_000} total={2_500} suffix=" / mo" />
          <UsageBar label="Workflow runs" used={4_820} total={10_000} suffix=" runs" />
        </div>
      </SettingsSection>

      <SettingsSection
        caption="Invoices"
        title="Last 6 invoices"
        actions={
          <Button variant="secondary" size="md">
            <Download className="h-4 w-4" />
            Download all
          </Button>
        }
      >
        <div className="overflow-hidden">
          <table className="w-full text-body">
            <thead className="border-y border-border-soft bg-subtle/30">
              <tr className="text-left text-caption uppercase text-ink-muted tracking-[0.08em]">
                <th className="font-medium px-5 py-2.5">Invoice</th>
                <th className="font-medium px-3 py-2.5">Period</th>
                <th className="font-medium px-3 py-2.5 text-right">Amount</th>
                <th className="font-medium px-3 py-2.5">Status</th>
                <th className="font-medium px-5 py-2.5 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((i) => (
                <tr key={i.id} className="border-b border-border-soft last:border-b-0 hover:bg-subtle/40 transition-colors">
                  <td className="px-5 py-3 font-mono text-body-sm text-ink-primary">{i.id}</td>
                  <td className="px-3 py-3 text-body-sm text-ink-secondary">{i.period}</td>
                  <td className="px-3 py-3 text-right font-mono text-body-sm tabular-nums text-ink-primary">
                    ${i.amount.toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    <Badge tone={i.status === "paid" ? "success" : "warning"} size="sm" dot>
                      {i.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-body-sm text-ink-muted hover:text-ink-primary inline-flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsSection>
    </div>
  );
}

const INVOICES = [
  { id: "INV-2026-04", period: "Apr 2026", amount: 4000, status: "paid" as const },
  { id: "INV-2026-03", period: "Mar 2026", amount: 4000, status: "paid" as const },
  { id: "INV-2026-02", period: "Feb 2026", amount: 4000, status: "paid" as const },
  { id: "INV-2026-01", period: "Jan 2026", amount: 4000, status: "paid" as const },
  { id: "INV-2025-12", period: "Dec 2025", amount: 4000, status: "paid" as const },
  { id: "INV-2025-11", period: "Nov 2025", amount: 4000, status: "paid" as const },
];

function UsageBar({
  label,
  used,
  total,
  suffix,
}: {
  label: string;
  used: number;
  total: number;
  suffix: string;
}) {
  const pct = (used / total) * 100;
  const tone = pct < 70 ? "bg-success-500" : pct < 90 ? "bg-warning-500" : "bg-danger-500";
  return (
    <div className="rounded-lg border border-border-soft bg-subtle/40 p-3">
      <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">{label}</p>
      <p className="mt-1 text-h3 text-ink-primary tabular-nums">
        {used.toLocaleString()} <span className="text-ink-muted text-body font-normal">/ {total.toLocaleString()}{suffix}</span>
      </p>
      <div className="mt-2 h-1.5 rounded-full bg-subtle overflow-hidden">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-[11px] text-ink-muted tabular-nums">{pct.toFixed(0)}% of plan</p>
    </div>
  );
}
