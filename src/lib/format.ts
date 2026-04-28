export function formatCurrency(value: number, opts: { compact?: boolean } = {}) {
  if (opts.compact) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, fractionDigits = 1) {
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatNumber(value: number, opts: { compact?: boolean } = {}) {
  if (opts.compact) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDuration(minutes: number) {
  const sign = minutes < 0 ? "-" : "";
  const m = Math.abs(minutes);
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h === 0) return `${sign}${r}m`;
  if (r === 0) return `${sign}${h}h`;
  return `${sign}${h}h ${r}m`;
}

export function formatDelta(value: number, format: "percent" | "number" = "percent") {
  const sign = value > 0 ? "+" : "";
  if (format === "percent") return `${sign}${value.toFixed(1)}%`;
  return `${sign}${formatNumber(value)}`;
}

export type KPIFormat = "currency" | "currency-compact" | "percent" | "number" | "duration";

export function formatBy(value: number, format: KPIFormat) {
  switch (format) {
    case "currency":
      return formatCurrency(value);
    case "currency-compact":
      return formatCurrency(value, { compact: true });
    case "percent":
      return formatPercent(value);
    case "duration":
      return formatDuration(value);
    case "number":
    default:
      return formatNumber(value);
  }
}
