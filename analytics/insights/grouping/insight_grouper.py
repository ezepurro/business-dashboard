from collections import defaultdict

from insights.models.insight import Insight
from insights.models.insight_group import InsightGroup


class InsightGrouper:

    def group(
        self,
        insights: list[Insight]
    ) -> list[InsightGroup]:

        grouped = defaultdict(list)

        for insight in insights:

            grouped[insight.category.value].append(
                insight
            )

        return [

            InsightGroup(

                category=category,

                insights=items

            )

            for category, items in grouped.items()

        ]