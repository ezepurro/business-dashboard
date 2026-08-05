import { Card } from '../ui/Card';
import type { AnalyticsChart, AnalyticsReport } from '../../types/analysis.types';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface Props {
  analytics: AnalyticsReport;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

function buildChartData(chart: AnalyticsChart) {
  const labels = chart.labels ?? [];
  const series = chart.series?.[0];

  if (!series) return [];

  return labels.map((label, index) => ({
    label,
    value: Number(series.points[index]?.value ?? 0),
    share: series.points[index]?.share,
  }));
}

export function AnalyticsChartsCard({ analytics }: Props) {
  const { t } = useTranslation();

  if (!analytics.charts.length) {
    return (
      <Card>
        <p className="text-sm text-foreground-secondary">{t('analysis.noCharts')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {analytics.charts.map((chart) => {
        const data = buildChartData(chart);

        const pieData = chart.labels.map((label, index) => ({
          label,
          value: chart.series[0]?.points[index] ?? 0,
        }));

        const chartType = chart.chart_type === 'histogram' ? 'bar' : chart.chart_type;

        return (
          <Card key={chart.id}>
            <h3 className="mb-1 text-lg font-semibold">{chart.title}</h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {chart.series.map((serie, index) => (
                      <Bar
                        key={serie.name}
                        dataKey={serie.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </BarChart>
                ) : chartType === 'line' ? (
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {chart.series.map((serie, index) => (
                      <Line
                        key={serie.name}
                        type="monotone"
                        dataKey={serie.name}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                ) : chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="label"
                      outerRadius={110}
                      label={({ label }) => label}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-foreground-secondary">
                    {t('analysis.unsupportedChart')}
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
