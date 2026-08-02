from unicodedata import category

from app.insights.builders.base_builder import BaseInsightBuilder

from app.insights.models.insight import Insight
from app.insights.models.insight_category import InsightCategory
from app.insights.models.insight_priority import InsightPriority

from app.profiling.models.dataset_profile import DatasetProfile


class QualityBuilder(BaseInsightBuilder):

    def build(
        self,
        profile: DatasetProfile
    ) -> list[Insight]:

        score = profile.quality.overall_score

        if score >= 90:
            priority = InsightPriority.LOW
        elif score >= 75:
            priority = InsightPriority.MEDIUM
        else:
            priority = InsightPriority.HIGH

        return [

            Insight(

                title="Calidad del dataset",

                description=f"El dataset obtuvo un puntaje de calidad de {score:.1f}/100.",

                category=InsightCategory.QUALITY,

                priority=priority,

                confidence=1.0,

                recommendations=[

                    "Revisar las métricas individuales de calidad para identificar oportunidades de mejora."

                ],

                business_impact=self.impact_from_priority(priority),

                next_action=self.default_next_action(category)

            )

        ]