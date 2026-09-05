'use client';

import { useId, useState } from 'react';

import { CHART_CATEGORICAL_COLORS, CHART_OTHER_COLOR, toPieSlices, type ChartDatum } from './palette';

interface PieChartProps {
  data: ChartDatum[];
  /** Shown in the donut center when no slice is focused/hovered. */
  totalLabel?: string;
}

const SIZE = 200;
const CENTER = SIZE / 2;
const OUTER_R = 90;
const INNER_R = 56;
const GAP_DEG = 2.5;

// Rounded to avoid SSR/client hydration mismatches from last-bit trig differences across engines.
function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

function polarToCartesian(radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: round(CENTER + radius * Math.cos(rad)), y: round(CENTER + radius * Math.sin(rad)) };
}

function donutSlicePath(startAngle: number, endAngle: number) {
  const clampedEnd = Math.min(endAngle, startAngle + 359.99);
  const startOuter = polarToCartesian(OUTER_R, clampedEnd);
  const endOuter = polarToCartesian(OUTER_R, startAngle);
  const startInner = polarToCartesian(INNER_R, clampedEnd);
  const endInner = polarToCartesian(INNER_R, startAngle);
  const largeArc = clampedEnd - startAngle > 180 ? 1 : 0;

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${OUTER_R} ${OUTER_R} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${INNER_R} ${INNER_R} 0 ${largeArc} 1 ${startInner.x} ${startInner.y}`,
    'Z',
  ].join(' ');
}

function colorForIndex(index: number, isOther: boolean) {
  return isOther ? CHART_OTHER_COLOR : CHART_CATEGORICAL_COLORS[index % CHART_CATEGORICAL_COLORS.length];
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);
}

export function PieChart({ data, totalLabel = 'Total' }: PieChartProps) {
  const slices = toPieSlices(data);
  const total = slices.reduce((sum, d) => sum + d.value, 0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const titleId = useId();

  if (total === 0) {
    return (
      <div className="flex h-[200px] w-[200px] shrink-0 items-center justify-center rounded-full border border-dashed border-border text-sm text-ink-faint">
        No data yet
      </div>
    );
  }

  const gap = slices.length > 1 ? GAP_DEG / 2 : 0;
  // Prefix sums of each slice's fraction, computed without mutating a shared cursor.
  const cumulativeStarts = slices.reduce<number[]>((acc) => {
    const prevEnd = acc.length > 0 ? acc[acc.length - 1] + slices[acc.length - 1].value / total : 0;
    return [...acc, prevEnd];
  }, []);

  const geometry = slices.map((slice, index) => {
    const fraction = slice.value / total;
    const startAngle = cumulativeStarts[index] * 360;
    const endAngle = (cumulativeStarts[index] + fraction) * 360;
    return {
      ...slice,
      index,
      isOther: slice.label === 'Other',
      percent: fraction * 100,
      path: donutSlicePath(startAngle + gap, endAngle - gap),
    };
  });

  const active = activeIndex !== null ? geometry[activeIndex] : null;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          role="img"
          aria-labelledby={titleId}
          className="overflow-visible"
        >
          <title id={titleId}>{`${totalLabel} breakdown`}</title>
          {geometry.map((slice) => (
            <path
              key={slice.label}
              d={slice.path}
              fill={colorForIndex(slice.index, slice.isOther)}
              tabIndex={0}
              role="button"
              aria-label={`${slice.label}: ${slice.value.toLocaleString()} (${slice.percent.toFixed(1)}%)`}
              onMouseEnter={() => setActiveIndex(slice.index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(slice.index)}
              onBlur={() => setActiveIndex(null)}
              className="cursor-pointer transition-[opacity,transform] duration-150 focus:outline-none"
              style={{
                transformOrigin: `${CENTER}px ${CENTER}px`,
                transform: activeIndex === slice.index ? 'scale(1.035)' : 'scale(1)',
                opacity: activeIndex === null || activeIndex === slice.index ? 1 : 0.55,
              }}
            >
              <title>{`${slice.label}: ${slice.value.toLocaleString()} (${slice.percent.toFixed(1)}%)`}</title>
            </path>
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {active ? (
            <>
              <span className="max-w-[100px] truncate text-xs font-medium text-ink-muted">{active.label}</span>
              <span className="font-display text-xl font-semibold text-ink">{formatCompact(active.value)}</span>
              <span className="text-xs text-ink-faint">{active.percent.toFixed(1)}%</span>
            </>
          ) : (
            <>
              <span className="font-display text-2xl font-semibold text-ink">{formatCompact(total)}</span>
              <span className="max-w-27.5 truncate px-2 text-xs font-medium text-ink-muted">{totalLabel}</span>
            </>
          )}
        </div>
      </div>

      <ul className="min-w-[160px] flex-1 space-y-1.5">
        {geometry.map((slice) => (
          <li
            key={slice.label}
            onMouseEnter={() => setActiveIndex(slice.index)}
            onMouseLeave={() => setActiveIndex(null)}
            className="flex items-center gap-2 rounded-md px-1.5 py-1 text-sm transition-colors"
            style={{ backgroundColor: activeIndex === slice.index ? 'var(--surface-sunken)' : 'transparent' }}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: colorForIndex(slice.index, slice.isOther) }}
            />
            <span className="min-w-0 flex-1 truncate text-ink">{slice.label}</span>
            <span className="shrink-0 tabular-nums text-ink-muted">{slice.value.toLocaleString()}</span>
            <span className="w-12 shrink-0 text-right tabular-nums text-ink-faint">{slice.percent.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
