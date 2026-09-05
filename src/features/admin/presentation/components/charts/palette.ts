// Fixed categorical hue order, validated for CVD-safe adjacency (dataviz color-formula).
// Never reorder per-chart and never generate a 9th hue — fold overflow into "Other".
export const CHART_CATEGORICAL_COLORS = [
  '#2a78d6', // blue
  '#eb6834', // orange
  '#1baf7a', // aqua
  '#eda100', // yellow
  '#e87ba4', // magenta
  '#008300', // green
  '#4a3aa7', // violet
  '#e34948', // red
] as const;

export const CHART_OTHER_COLOR = '#898781';

export const CHART_MAX_SLICES = CHART_CATEGORICAL_COLORS.length;

export interface ChartDatum {
  label: string;
  value: number;
}

/** Sorts descending and folds anything past the categorical ceiling into a single "Other" slice. */
export function toPieSlices(data: ChartDatum[]): ChartDatum[] {
  const sorted = [...data].filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  if (sorted.length <= CHART_MAX_SLICES) return sorted;

  const head = sorted.slice(0, CHART_MAX_SLICES - 1);
  const tailTotal = sorted.slice(CHART_MAX_SLICES - 1).reduce((sum, d) => sum + d.value, 0);
  return [...head, { label: 'Other', value: tailTotal }];
}
