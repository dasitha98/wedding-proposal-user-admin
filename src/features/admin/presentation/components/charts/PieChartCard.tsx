'use client';

import { Card } from '../../../../../shared/components';
import { PieChart } from './PieChart';
import type { ChartDatum } from './palette';

interface PieChartCardProps {
  title: string;
  subtitle?: string;
  data: ChartDatum[];
  totalLabel?: string;
  isLoading?: boolean;
}

export function PieChartCard({ title, subtitle, data, totalLabel, isLoading }: PieChartCardProps) {
  return (
    <Card className="p-6">
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      {subtitle ? <p className="mt-0.5 text-xs text-ink-faint">{subtitle}</p> : null}
      <div className="mt-4">
        {isLoading ? (
          <div className="h-[200px] w-[200px] animate-shimmer rounded-full" />
        ) : (
          <PieChart data={data} totalLabel={totalLabel ?? title} />
        )}
      </div>
    </Card>
  );
}
