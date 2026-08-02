from app.insights.models.insight import Insight
from app.insights.models.insight_priority import InsightPriority


class InsightPrioritySorter:

    ORDER = {

        InsightPriority.CRITICAL: 0,

        InsightPriority.HIGH: 1,

        InsightPriority.MEDIUM: 2,

        InsightPriority.LOW: 3,

        InsightPriority.INFO: 4,

    }

    def process(

        self,

        insights: list[Insight]

    ) -> list[Insight]:

        return sorted(

            insights,

            key=lambda insight: (

                self.ORDER.get(

                    insight.priority,

                    99

                ),

                -(

                    insight.confidence

                    or 0

                )

            )

        )