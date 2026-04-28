import { Building2, Globe2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SettingsSection, Field } from "./_shared";

export function WorkspaceSection() {
  return (
    <div className="space-y-5">
      <SettingsSection
        caption="Workspace"
        title="Company profile"
        description="Used across MeetingIQ's invitations, summaries, and login screen."
        actions={<Button variant="primary" size="md">Save changes</Button>}
      >
        <div className="px-5 pb-5 grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-5 items-start">
          {/* Logo */}
          <div className="space-y-2">
            <p className="text-caption uppercase tracking-[0.1em] text-ink-muted">Logo</p>
            <button className="relative h-24 w-24 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-ink-invert shadow-elev-1 group">
              <span className="font-display text-[32px] font-semibold leading-none">N</span>
              <span className="absolute inset-0 rounded-xl bg-ink-primary/40 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center">
                <Camera className="h-5 w-5" />
              </span>
            </button>
            <p className="text-[11px] text-ink-muted">PNG / SVG · max 2 MB</p>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Company name">
              <Input defaultValue="Northwind Inc." />
            </Field>
            <Field label="Display name" hint="Shown in the sidebar.">
              <Input defaultValue="Northwind" />
            </Field>
            <Field label="Headquarters">
              <Input defaultValue="San Francisco, CA · 1 Market Plaza" />
            </Field>
            <Field label="Employee count">
              <Input defaultValue="100 — Enterprise tier" />
            </Field>
            <Field label="Departments">
              <Input defaultValue="8 active" />
            </Field>
            <Field label="Time zone" hint="Used for meeting scheduling and reporting.">
              <Input defaultValue="America / Los Angeles (PT)" />
            </Field>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        caption="Region & locale"
        title="Operating defaults"
        description="Defaults applied across reports, invoicing, and customer-facing communications."
      >
        <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Currency">
            <Input defaultValue="USD ($)" />
          </Field>
          <Field label="Distance">
            <Input defaultValue="Miles (mi)" />
          </Field>
          <Field label="Date format">
            <Input defaultValue="MM/DD/YYYY" />
          </Field>
        </div>
      </SettingsSection>

      <SettingsSection caption="Trust" title="Compliance">
        <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ComplianceTile icon={<Globe2 className="h-4 w-4" />} label="Data residency" value="US-East · Virginia" />
          <ComplianceTile label="Audit logging" value="On — all actions" badge={<Badge tone="success" size="sm" dot>Live</Badge>} />
          <ComplianceTile icon={<Building2 className="h-4 w-4" />} label="SOC 2 Type II" value="Verified · Apr 2026" />
        </div>
      </SettingsSection>
    </div>
  );
}

function ComplianceTile({
  icon,
  label,
  value,
  badge,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border-soft bg-subtle/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-ink-muted text-caption uppercase tracking-[0.1em]">
          {icon}
          {label}
        </div>
        {badge}
      </div>
      <p className="mt-1 text-body font-medium text-ink-primary">{value}</p>
    </div>
  );
}
