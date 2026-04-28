import { Plus, Search, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SettingsSection } from "./_shared";
import { USERS, type Role } from "@/mocks/seed/users";
import { cn } from "@/lib/utils";

const ROLE_TONE: Record<Role, "accent" | "info" | "success" | "neutral"> = {
  CEO: "accent",
  COO: "accent",
  VP: "info",
  Director: "info",
  Manager: "success",
  "Senior IC": "neutral",
  IC: "neutral",
};

const MEMBERS = USERS.map((u, i) => ({
  ...u,
  lastActive: ["now", "3m ago", "12m ago", "1h ago", "Today", "Yesterday"][i % 6],
}));

export function MembersSection() {
  return (
    <div className="space-y-5">
      <SettingsSection
        caption="Members & roles"
        title={`${MEMBERS.length} members in this workspace`}
        description="MeetingIQ uses role-based access with department-level permissions. Adjust per role under Roles → Customize."
        actions={
          <>
            <Button variant="secondary" size="md">
              Manage roles
            </Button>
            <Button variant="primary" size="md">
              <Plus className="h-4 w-4" />
              Invite member
            </Button>
          </>
        }
      >
        <div className="px-5 pb-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <Input placeholder="Search by name, email, role…" className="pl-9 bg-subtle/40 border-border-soft" />
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="w-full text-body">
            <thead className="border-b border-border-soft">
              <tr className="text-left text-caption uppercase text-ink-muted tracking-[0.08em]">
                <th className="font-medium px-5 py-2.5">Member</th>
                <th className="font-medium px-3 py-2.5">Role</th>
                <th className="font-medium px-3 py-2.5">Department</th>
                <th className="font-medium px-3 py-2.5">2FA</th>
                <th className="font-medium px-3 py-2.5">Last active</th>
                <th className="font-medium px-5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {MEMBERS.map((m) => {
                const initials = m.name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2);
                return (
                  <tr
                    key={m.id}
                    className="border-b border-border-soft last:border-b-0 hover:bg-subtle/40 transition-colors group"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 grid place-items-center text-ink-invert text-[11px] font-semibold">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-body-sm font-medium text-ink-primary truncate">{m.name}</p>
                          <p className="text-[11px] text-ink-muted truncate">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={ROLE_TONE[m.role]} size="sm">
                        {m.role}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-body-sm text-ink-secondary">{m.department}</td>
                    <td className="px-3 py-3">
                      {m.is2FA ? (
                        <span className="inline-flex items-center gap-1 text-body-sm text-success-700">
                          <ShieldCheck className="h-3.5 w-3.5" /> Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-body-sm text-warning-700">
                          <ShieldAlert className="h-3.5 w-3.5" /> Required soon
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-body-sm font-mono text-ink-muted">{m.lastActive}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        className={cn(
                          "h-8 px-3 rounded-md text-body-sm text-ink-muted",
                          "hover:bg-subtle hover:text-ink-primary opacity-0 group-hover:opacity-100 transition"
                        )}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SettingsSection>

      <SettingsSection caption="Roles" title="Permission summary">
        <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <RoleTile name="Executive (CEO/COO)" perms={["Full company view", "All decisions", "Audit logs", "Billing"]} />
          <RoleTile name="VP / Director" perms={["Department view", "Decisions in their org", "Approve workflows"]} />
          <RoleTile name="Manager" perms={["Team meetings", "Action ownership", "Coaching digest"]} />
          <RoleTile name="IC" perms={["Own meetings", "Assigned actions", "Knowledge search"]} />
          <RoleTile name="Read only" perms={["View dashboards", "View reports"]} />
        </div>
      </SettingsSection>
    </div>
  );
}

function RoleTile({ name, perms }: { name: string; perms: string[] }) {
  return (
    <div className="rounded-lg border border-border-soft bg-subtle/40 p-3">
      <p className="text-body font-medium text-ink-primary">{name}</p>
      <ul className="mt-1.5 space-y-0.5">
        {perms.map((p) => (
          <li key={p} className="text-[11px] text-ink-muted flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-ink-muted/60" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
