export type TrendPoint = { day: string; otd: number; util: number; cost: number; margin: number };

const days = ["Mar 1", "Mar 4", "Mar 7", "Mar 10", "Mar 13", "Mar 16", "Mar 19", "Mar 22", "Mar 25", "Mar 28"];

export const PERFORMANCE_30D: TrendPoint[] = days.map((day, i) => {
  const base = i / (days.length - 1);
  const noise = Math.sin(i * 1.4) * 0.4;
  return {
    day,
    otd: 92 + base * 3 + noise,
    util: 82 + base * 5 + noise * 0.6,
    cost: 1.96 - base * 0.12 + noise * 0.02,
    margin: 16.2 + base * 2.6 + noise * 0.3,
  };
});
