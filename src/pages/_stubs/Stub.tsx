import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";

export function Stub({ name, blurb }: { name: string; blurb: string }) {
  return (
    <div className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 reveal-stack">
      <PageHeader title={name} subtitle={blurb} />
      <Card className="p-12 grain ai-edge">
        <div className="max-w-md">
          <Badge tone="accent" size="sm" dot>
            On the build queue
          </Badge>
          <h2 className="mt-3 font-display text-h2 text-ink-primary">
            This screen is part of the build queue.
          </h2>
          <p className="mt-2 text-body text-ink-muted">
            The Executive Dashboard ships first. {name} is next in the sequence — we'll
            wire it up after dashboard sign-off.
          </p>
          <div className="mt-5 inline-flex items-center gap-1.5 text-accent-700 text-body-sm font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Want to demo this one next? Ping FreightIQ.
          </div>
        </div>
      </Card>
    </div>
  );
}
