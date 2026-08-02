from collections import defaultdict

from app.insights.models.insight import Insight
from app.insights.models.insight_group import InsightGroup
from app.insights.models.insight_priority import InsightPriority


class InsightGrouper:

    PRIORITY_ORDER = {

        InsightPriority.CRITICAL: 0,

        InsightPriority.HIGH: 1,

        InsightPriority.MEDIUM: 2,

        InsightPriority.LOW: 3,

        InsightPriority.INFO: 4,

    }

    def group(
        self,
        insights: list[Insight]
    ) -> list[InsightGroup]:

        grouped: dict[str, list[Insight]] = defaultdict(list)

        for insight in insights:

            grouped[insight.category.value].append(
                insight
            )

        groups = []

        for category, items in grouped.items():

            highest_priority = min(
                (
                    insight.priority
                    for insight in items
                ),
                key=lambda priority: self.PRIORITY_ORDER[priority]
            )

            groups.append(

                InsightGroup(

                    category=category,

                    priority=highest_priority,

                    insight_count=len(items),

                    critical_count=sum(

                        1

                        for insight in items

                        if insight.priority == InsightPriority.CRITICAL

                    ),

                    high_count=sum(

                        1

                        for insight in items

                        if insight.priority == InsightPriority.HIGH

                    ),

                    insights=items

                )

            )

        return groups