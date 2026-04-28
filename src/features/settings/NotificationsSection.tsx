import { useState } from "react";
import { Mail, MessageSquare, Bell } from "lucide-react";
import { SettingsSection, Toggle } from "./_shared";
import { NOTIFICATION_RULES, type NotificationRule } from "@/mocks/seed/settings";
import { cn } from "@/lib/utils";

export function NotificationsSection() {
  const [rules, setRules] = useState<NotificationRule[]>(NOTIFICATION_RULES);

  const setChannel = (
    id: string,
    ch: keyof NotificationRule["channels"],
    value: boolean
  ) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, channels: { ...r.channels, [ch]: value } } : r))
    );
  };

  return (
    <SettingsSection
      caption="Notifications"
      title="Where each event lands"
      description="Anything noisier than once-an-hour reaches Slack only. Critical events land everywhere."
    >
      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="border-y border-border-soft bg-subtle/30">
            <tr className="text-left text-caption uppercase text-ink-muted tracking-[0.08em]">
              <th className="font-medium px-5 py-2.5">Event</th>
              <th className="font-medium px-3 py-2.5 w-24 text-center">
                <span className="inline-flex items-center gap-1 justify-center">
                  <Mail className="h-3 w-3" /> Email
                </span>
              </th>
              <th className="font-medium px-3 py-2.5 w-24 text-center">
                <span className="inline-flex items-center gap-1 justify-center">
                  <MessageSquare className="h-3 w-3" /> Slack
                </span>
              </th>
              <th className="font-medium px-5 py-2.5 w-24 text-center">
                <span className="inline-flex items-center gap-1 justify-center">
                  <Bell className="h-3 w-3" /> Push
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} className="border-b border-border-soft last:border-b-0 hover:bg-subtle/40 transition-colors">
                <td className="px-5 py-3">
                  <p className="text-body font-medium text-ink-primary">{r.label}</p>
                </td>
                {(["email", "slack", "push"] as const).map((ch) => (
                  <td key={ch} className={cn("px-3 py-3 text-center", ch === "push" && "px-5")}>
                    <div className="inline-flex">
                      <Toggle on={r.channels[ch]} onChange={(v) => setChannel(r.id, ch, v)} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SettingsSection>
  );
}
