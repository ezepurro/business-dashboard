from unicodedata import category

from app.insights.builders.base_builder import BaseInsightBuilder

from app.insights.models.insight import Insight
from app.insights.models.insight_category import InsightCategory
from app.insights.models.insight_priority import InsightPriority

from app.profiling.models.dataset_profile import DatasetProfile


class SalesBuilder(BaseInsightBuilder):

    def build(
        self,
        profile: DatasetProfile
    ) -> list[Insight]:

        result = self.get_result(
            profile,
            "SalesAnalyzer"
        )

        insights = self.build_from_result(
            result,
            InsightCategory.SALES
        )

        if result is None:
            return insights

        category = InsightCategory.SALES
        
        priority = InsightPriority.LOW

        for metric in result.metrics:

            if metric.name == "total_sales":

                insights.append(

                    Insight(

                        title="Ventas totales",

                        description=f"El dataset registra ventas por un total de {metric.value}.",

                        category=category,

                        priority=InsightPriority.HIGH,

                        confidence=metric.confidence or 1.0,

                        related_metrics=[metric.name],

                        recommendations=[

                            "Utilizar esta métrica como KPI principal.",

                            "Comparar este valor entre distintos períodos."

                        ],

                        business_impact=self.impact_from_priority(priority),

                        next_action=self.default_next_action(category)

                    )

                )

            elif metric.name == "average_sale":

                insights.append(

                    Insight(

                        title="Ticket promedio",

                        description=f"El ticket promedio es de {metric.value}.",

                        category=InsightCategory.SALES,

                        priority=InsightPriority.MEDIUM,

                        confidence=metric.confidence or 1.0,

                        related_metrics=[metric.name],

                        recommendations=[

                            "Comparar el ticket promedio entre períodos.",

                            "Analizar oportunidades para incrementar el valor promedio."

                        ]

                    )

                )

        return insights