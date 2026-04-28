import { Sparkles, ShieldCheck, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SettingsSection, Toggle } from "./_shared";
import { AI_SETTINGS, type AISetting } from "@/mocks/seed/settings";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AISection() {
  return (
    <div className="space-y-5">
      <SettingsSection
        caption="AI & Automation"
        title="How aggressively should FreightIQ act?"
        description={
          <>
            These thresholds decide which agent decisions are auto-executed and which land in your{" "}
            <span className="text-accent-700 font-medium">approval inbox</span>. Tighten for caution; loosen for
            throughput.
          </>
        }
      >
        <div className="px-5 pb-5 space-y-4">
          {AI_SETTINGS.map((s) => (
            <ThresholdRow key={s.id} setting={s} />
          ))}
        </div>
      </SettingsSection>

      <SettingsSection caption="Guardrails" title="Where humans always stay in the loop">
        <div className="px-5 pb-5 space-y-2.5">
          <Guardrail
            label="Re-broker decisions"
            blurb="Always require dispatcher approval — too easy to mis-price a load."
            on
          />
          <Guardrail
            label="Customer SLA changes"
            blurb="Notify the customer success owner before sending the EDI 990."
            on
          />
          <Guardrail
            label="Driver coaching emails"
            blurb="Manager reviews the AI-drafted message before send."
            on={false}
          />
          <Guardrail
            label="Detention auto-billing > $500"
            blurb="Single line items over this amount go to finance for review."
            on
          />
        </div>
      </SettingsSection>

      <SettingsSection caption="Trust" title="Audit & explainability">
        <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <TrustTile
            icon={<ShieldCheck className="h-4 w-4 text-success-500" />}
            label="Action audit log"
            value="Every agent action retained for 7 years"
            badge={<Badge tone="success" size="sm" dot>On</Badge>}
          />
          <TrustTile
            icon={<Eye className="h-4 w-4 text-brand-500" />}
            label="Decision explainability"
            value="Each suggestion stores the model + features it used"
            badge={<Badge tone="info" size="sm" dot>On</Badge>}
          />
          <TrustTile
            icon={<Sparkles className="h-4 w-4 text-accent-500" />}
            label="Model recalibration"
            value="Auto, weekly · last run Apr 27"
            badge={<Badge tone="accent" size="sm" dot>Auto</Badge>}
          />
        </div>
      </SettingsSection>
    </div>
  );
}

function ThresholdRow({ setting }: { setting: AISetting }) {
  const [v, setV] = useState(setting.value);
  const range = setting.max - setting.min;
  const pct = ((v - setting.min) / range) * 100;
  const formatted =
    setting.unit === "$"
      ? `${v < 0 ? "-" : ""}$${Math.abs(v).toLocaleString()}`
      : `${v}${setting.unit}`;

  return (
    <div className="rounded-lg border border-border-soft p-4 hover:border-border transition-colors">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <p className="text-body font-medium text-ink-primary">{setting.label}</p>
          <p className="text-body-sm text-ink-muted leading-relaxed mt-0.5 max-w-prose">
            {setting.description}
          </p>
        </div>
        <span className="text-h3 tabular-nums text-ink-primary">{formatted}</span>
      </div>
      <div className="mt-3 relative">
        <input
          type="range"
          min={setting.min}
          max={setting.max}
          value={v}
          onChange={(e) => setV(Number(e.target.value))}
          className="w-full h-1 rounded-full bg-subtle appearance-none cursor-pointer accent-brand-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow"
        />
        <div className="mt-1 flex justify-between text-[10px] text-ink-muted font-mono tabular-nums">
          <span>{setting.unit === "$" ? `$${setting.min}` : `${setting.min}${setting.unit}`}</span>
          <span className={cn("transition-colors", pct >= 60 ? "text-brand-700" : "text-ink-muted")}>
            {Math.round(pct)}% of range
          </span>
          <span>{setting.unit === "$" ? `$${setting.max}` : `${setting.max}${setting.unit}`}</span>
        </div>
      </div>
    </div>
  );
}

function Guardrail({ label, blurb, on }: { label: string; blurb: string; on: boolean }) {
  const [enabled, setEnabled] = useState(on);
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border-soft p-3 hover:border-border transition-colors">
      <div className="min-w-0">
        <p className="text-body font-medium text-ink-primary">{label}</p>
        <p className="text-body-sm text-ink-muted mt-0.5 leading-snug max-w-prose">{blurb}</p>
      </div>
      <Toggle on={enabled} onChange={setEnabled} />
    </div>
  );
}

function TrustTile({
  icon,
  label,
  value,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge: React.ReactNode;
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
      <p className="mt-1 text-body-sm text-ink-primary leading-snug">{value}</p>
    </div>
  );
}

