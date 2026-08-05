import { useState } from 'react';
import { Card } from '../ui/Card';
import { useTranslation } from 'react-i18next';
import type { InsightGroup } from '../../types/analysis.types';

interface Props {
  groups: InsightGroup[];
}

function priorityClass(priority?: string) {
  switch ((priority ?? '').toLowerCase()) {
    case 'critical':
      return 'bg-red-500/10 text-red-600';

    case 'high':
      return 'bg-orange-500/10 text-orange-600';

    case 'medium':
      return 'bg-yellow-500/10 text-yellow-700';

    default:
      return 'bg-green-500/10 text-green-600';
  }
}

export function InsightsGroupsCard({ groups }: Props) {
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState<string[]>([]);

  if (!groups.length) {
    return (
      <Card>
        <p className="text-sm text-foreground-secondary">{t('analysis.noInsights')}</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-6">
        {groups.map((group) => {
          const isOpen = expanded.includes(group.category);

          return (
            <div key={group.category}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left transition hover:bg-muted/40"
                onClick={() =>
                  setExpanded((current) =>
                    isOpen
                      ? current.filter((g) => g !== group.category)
                      : [...current, group.category],
                  )
                }
              >
                <div>
                  <div className="font-semibold capitalize">{group.category}</div>

                  <div className="text-xs text-foreground-secondary">
                    {group.insights.length} insights
                  </div>
                </div>

                <span>{isOpen ? '−' : '+'}</span>
              </button>

              {isOpen && (
                <div className="mt-4 space-y-4">
                  {group.insights.map((insight, index) => (
                    <div
                      key={`${group.category}-${index}`}
                      className="rounded-lg border border-border bg-background p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{insight.title}</h4>

                        <span
                          className={`rounded px-2 py-1 text-xs font-medium ${priorityClass(
                            insight.priority,
                          )}`}
                        >
                          {insight.priority.toUpperCase()}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-foreground-secondary">
                        {insight.description}
                      </p>

                      {insight.related_columns.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {insight.related_columns.map((column) => (
                            <span key={column} className="rounded bg-muted px-2 py-1 text-xs">
                              {column}
                            </span>
                          ))}
                        </div>
                      )}

                      {insight.recommendations.length > 0 && (
                        <div className="mt-4 rounded-lg bg-primary/5 p-3">
                          <p className="mb-2 text-xs font-semibold uppercase">Recomendaciones</p>

                          <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-secondary">
                            {insight.recommendations.map((recommendation) => (
                              <li key={recommendation}>{recommendation}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
