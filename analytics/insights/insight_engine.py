from insights.builders.analytics_builder import AnalyticsBuilder
from insights.builders.cleaning_builder import CleaningBuilder
from insights.builders.customer_builder import CustomerBuilder
from insights.builders.executive_summary_builder import ExecutiveSummaryBuilder
from insights.builders.geographic_builder import GeographicBuilder
from insights.builders.product_builder import ProductBuilder
from insights.builders.quality_builder import QualityBuilder
from insights.builders.sales_builder import SalesBuilder
from insights.builders.time_builder import TimeBuilder
from insights.builders.transformation_builder import TransformationBuilder

from insights.grouping.insight_grouper import InsightGrouper

from insights.models.insight import Insight
from insights.models.insight_report import InsightReport

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

    def analyze(
        self,
        profile: DatasetProfile
    ) -> InsightReport:

        insights: list[Insight] = []

        for builder in self.builders:

            insights.extend(

                builder.build(profile)

            )

        groups = self.grouper.group(
            insights
        )

        summary = self.summary_builder.build(

            profile,

            insights

        )

        return InsightReport(

            summary=summary,

            insights=insights,

            groups=groups

        )