from app.insights.models.insight import Insight


class InsightDeduplicator:

    def process(
        self,
        insights: list[Insight]
    ) -> list[Insight]:

        unique = {}

        for insight in insights:

            key = (

                insight.category,

                insight.title.strip().lower()

            )

            if key not in unique:

                unique[key] = insight

                continue

            current = unique[key]

            if (

                insight.confidence

                >

                current.confidence

            ):

                unique[key] = insight

        return list(

            unique.values()

        )