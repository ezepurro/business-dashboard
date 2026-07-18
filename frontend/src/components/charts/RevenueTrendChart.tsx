import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MonthlyTrend } from '../../types/analysis.types';
import { formatCurrency } from '../../utils/format';

interface RevenueTrendChartProps {
  data: MonthlyTrend[];
  currency: string;
}

export function RevenueTrendChart({ data, currency }: RevenueTrendChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="var(--color-muted)"
            tickLine={false}
            axisLine={{ stroke: 'var(--color-border)' }}
            fontSize={12}
          />
          <YAxis
            stroke="var(--color-muted)"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            width={64}
            tickFormatter={(value: number) => formatCurrency(value, currency).replace(/\.00$/, '')}
          />
          <Tooltip
            cursor={{ stroke: 'var(--color-border)' }}
            contentStyle={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ color: 'var(--color-foreground)' }}
            formatter={(value) => [formatCurrency(Number(value), currency), 'Revenue']}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            dot={{ r: 4, fill: 'var(--color-chart-1)', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
