from app.insights.models.insight import Insight
from app.insights.models.insight_priority import InsightPriority


class InsightLimiter:

    MAX_LOW = 10

    def process(

        self,

        insights: list[Insight]

    ) -> list[Insight]:

        result = []

        low = 0

        for insight in insights:

            if insight.priority in (

                InsightPriority.LOW,

                InsightPriority.INFO

            ):

                if low >= self.MAX_LOW:

                    continue

                low += 1

            result.append(

                insight

            )

        return result