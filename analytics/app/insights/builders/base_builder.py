from abc import ABC, abstractmethod

from app.analytics.models.analysis_result import AnalysisResult

from app.insights.models.insight import Insight
from app.insights.models.insight_category import InsightCategory
from app.insights.models.insight_priority import InsightPriority

from app.profiling.models.dataset_profile import DatasetProfile


class BaseInsightBuilder(ABC):

    @abstractmethod
    def build(
        self,
        profile: DatasetProfile
    ) -> list[Insight]:
        pass

    def get_result(
        self,
        profile: DatasetProfile,
        analyzer_name: str
    ) -> AnalysisResult | None:

        if profile.analytics is None:
            return None

        return profile.analytics.analyzer_results.get(
            analyzer_name
        )

    def impact_from_priority(
        self,
        priority: InsightPriority
    ) -> str:

        mapping = {

            InsightPriority.CRITICAL: "critical",

            InsightPriority.HIGH: "high",

            InsightPriority.MEDIUM: "medium",

            InsightPriority.LOW: "low",

            InsightPriority.INFO: "low"

        }

        return mapping.get(
            priority,
            "medium"
        )

    def default_next_action(
        self,
        category: InsightCategory
    ) -> str:

        mapping = {

        InsightCategory.SALES:
            "Analizar las ventas por período y canal.",

        InsightCategory.PRODUCT:
            "Revisar el desempeño de los productos.",

        InsightCategory.CUSTOMER:
            "Segmentar los clientes detectados.",

        InsightCategory.QUALITY:
            "Corregir los problemas de calidad.",

        InsightCategory.CLEANING:
            "Aplicar las limpiezas sugeridas.",

        InsightCategory.TRANSFORMATION:
            "Aplicar las transformaciones recomendadas.",

        InsightCategory.ANALYTICS:
            "Profundizar el análisis de las métricas.",

        InsightCategory.GEOGRAPHY:
            "Comparar resultados entre regiones."

        }

        return mapping.get(
            category,
            "Revisar el insight."
        )

    def build_from_result(
        self,
        result: AnalysisResult | None,
        category: InsightCategory
    ) -> list[Insight]:

        if result is None:
            return []

        severity_map = {

            "critical": InsightPriority.CRITICAL,
            "high": InsightPriority.HIGH,
            "medium": InsightPriority.MEDIUM,
            "low": InsightPriority.LOW,
            "info": InsightPriority.LOW,

        }

        chart_titles = [

            chart.title

            for chart in result.charts

            if chart.title

        ]

        insights = []

        for finding in result.findings:

            insights.append(

                Insight(

                    title=finding.title,

                    description=finding.description,

                    category=category,

                    priority=severity_map.get(

                        finding.severity.lower(),
                        InsightPriority.MEDIUM

                    ),

                    confidence=finding.confidence,

                    related_columns=finding.related_columns,

                    related_metrics=finding.metric_names,

                    evidence=finding.evidence + chart_titles,

                    recommendations=[]

                )

            )

        return insights