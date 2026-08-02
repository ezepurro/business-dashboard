from unicodedata import category

from app.insights.builders.base_builder import BaseInsightBuilder

from app.insights.models.insight import Insight
from app.insights.models.insight_category import InsightCategory
from app.insights.models.insight_priority import InsightPriority

from app.profiling.models.dataset_profile import DatasetProfile


class CleaningBuilder(BaseInsightBuilder):

    def build(
        self,
        profile: DatasetProfile
    ) -> list[Insight]:

        insights = []

        category = InsightCategory.CLEANING

        priority = InsightPriority.LOW

        for action in profile.cleaning.actions:

            insights.append(

                Insight(

                    title="Limpieza aplicada",

                    description=action.description,

                    category=category,

                    priority=priority,

                    confidence=action.confidence,

                    related_columns=[action.column],

                    business_impact=self.impact_from_priority(
                        priority
                    ),

                    next_action=self.default_next_action(
                        category
                    )

                )

            )

        return insights