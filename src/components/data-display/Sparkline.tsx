import { useMemo } from "react";

type Props = {
  data: number[];
  className?: string;
  positive?: boolean;
  width?: number;
  height?: number;
};

export function Sparkline({ data, positive = true, width = 96, height = 28, className }: Props) {
  const path = useMemo(() => {
    if (!data.length) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    return data
      .map((v, i) => {
        const x = i * stepX;
        const y = height - ((v - min) / range) * height;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }, [data, width, height]);

  const areaPath = useMemo(() => {
    if (!path) return "";
    return `${path} L${width},${height} L0,${height} Z`;
  }, [path, width, height]);

  const stroke = positive ? "hsl(var(--success-500))" : "hsl(var(--danger-500))";
  const fill = positive ? "hsl(var(--success-500) / 0.12)" : "hsl(var(--danger-500) / 0.12)";

  return (
    <svg width={width} height={height} className={className} viewBox={`0 0 ${width} ${height}`}>
      <path d={areaPath} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
