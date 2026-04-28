import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  inverted?: boolean;
  className?: string;
};

export function DeltaPill({ value, inverted = false, className }: Props) {
  const isUp = value > 0;
  const isFlat = value === 0;
  const isGood = isFlat ? null : inverted ? !isUp : isUp;

  const tone = isFlat
    ? "text-ink-muted bg-subtle"
    : isGood
    ? "text-success-700 bg-success-50"
    : "text-danger-700 bg-danger-50";

  const Icon = isFlat ? Minus : isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[0.75rem] font-medium tabular-nums",
        tone,
        className
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2.25} />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}
