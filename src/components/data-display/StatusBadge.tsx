import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/status";

export function StatusBadge({ status }: { status: string }) {
  const tone = (STATUS_TONE[status] ?? "neutral") as
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "accent"
    | "neutral";
  const label = STATUS_LABEL[status] ?? status;
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}
