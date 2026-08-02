from app.insights.builders.analytics_builder import AnalyticsBuilder
from app.insights.builders.cleaning_builder import CleaningBuilder
from app.insights.builders.customer_builder import CustomerBuilder
from app.insights.builders.executive_summary_builder import ExecutiveSummaryBuilder
from app.insights.builders.geographic_builder import GeographicBuilder
from app.insights.builders.product_builder import ProductBuilder
from app.insights.builders.quality_builder import QualityBuilder
from app.insights.builders.sales_builder import SalesBuilder
from app.insights.builders.time_builder import TimeBuilder
from app.insights.builders.transformation_builder import TransformationBuilder

from app.insights.grouping.insight_grouper import InsightGrouper

from app.insights.models.insight import Insight
from app.insights.models.insight_report import InsightReport

from app.insights.processing.insight_deduplicator import InsightDeduplicator
from app.insights.processing.insight_priority_sorter import InsightPrioritySorter
from app.insights.processing.insight_limiter import InsightLimiter

from app.profiling.models.dataset_profile import DatasetProfile


class InsightEngine:

    def __init__(self):

        self.builders = [

            SalesBuilder(),

            TimeBuilder(),

            ProductBuilder(),

            CustomerBuilder(),

            GeographicBuilder(),

            QualityBuilder(),

            CleaningBuilder(),

            TransformationBuilder(),

            AnalyticsBuilder()

        ]

        self.summary_builder = ExecutiveSummaryBuilder()

        self.grouper = InsightGrouper()

        self.deduplicator = InsightDeduplicator()

        self.sorter = InsightPrioritySorter()

        self.limiter = InsightLimiter()

    def analyze(
        self,
        profile: DatasetProfile
    ) -> InsightReport:

        insights: list[Insight] = []

        for builder in self.builders:

            insights.extend(

                builder.build(profile)

            )

        # 1. Eliminar duplicados
        insights = self.deduplicator.process(
            insights
        )

        # 2. Ordenar por prioridad
        insights = self.sorter.process(
            insights
        )

        # 3. Limitar insights de baja prioridad
        insights = self.limiter.process(
            insights
        )

        # 4. Agrupar los insights finales
        groups = self.grouper.group(
            insights
        )

        # 5. Ordenar grupos por prioridad
        groups.sort(

            key=lambda group:

                self.sorter.ORDER.get(

                    group.priority,

                    99

                )

        )

        # 6. Construir resumen ejecutivo
        summary = self.summary_builder.build(

            profile,

            insights

        )

        return InsightReport(

            summary=summary,

            insights=insights,

            groups=groups

        )