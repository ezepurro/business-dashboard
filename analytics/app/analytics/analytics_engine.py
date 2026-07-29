from pandas import DataFrame

from app.analytics.analyzers.base_analyzer import BaseAnalyzer
from app.analytics.analyzers.category_analyzer import CategoryAnalyzer
from app.analytics.analyzers.correlation_analyzer import CorrelationAnalyzer
from app.analytics.analyzers.customer_analyzer import CustomerAnalyzer
from app.analytics.analyzers.distribution_analyzer import DistributionAnalyzer
from app.analytics.analyzers.geographic_analyzer import GeographicAnalyzer
from app.analytics.analyzers.outlier_analyzer import OutlierAnalyzer
from app.analytics.analyzers.payment_analyzer import PaymentAnalyzer
from app.analytics.analyzers.product_analyzer import ProductAnalyzer
from app.analytics.analyzers.sales_analyzer import SalesAnalyzer
from app.analytics.analyzers.status_analyzer import StatusAnalyzer
from app.analytics.analyzers.time_analyzer import TimeAnalyzer
from app.analytics.models.analysis_result import AnalysisResult
from app.analytics.models.analytics_report import AnalyticsReport
from app.profiling.models.dataset_metadata import DatasetMetadata


class AnalyticsEngine:

    def __init__(
        self,
        analyzers: list[BaseAnalyzer] | None = None
    ):

        self.analyzers = analyzers if analyzers is not None else [
            SalesAnalyzer(),
            TimeAnalyzer(),
            ProductAnalyzer(),
            CustomerAnalyzer(),
            DistributionAnalyzer(),
            CorrelationAnalyzer(),
            OutlierAnalyzer(),
            CategoryAnalyzer(),
            GeographicAnalyzer(),
            PaymentAnalyzer(),
            StatusAnalyzer(),
        ]

    def analyze(
        self,
        df: DataFrame,
        metadata: DatasetMetadata
    ) -> AnalyticsReport:

        metrics = []
        charts = []
        findings = []
        analyzer_results: dict[str, AnalysisResult] = {}

        for analyzer in self.analyzers:
            result = analyzer.analyze(df, metadata)
            analyzer_name = analyzer.__class__.__name__

            analyzer_results[analyzer_name] = result
            metrics.extend(result.metrics)
            charts.extend(result.charts)
            findings.extend(result.findings)

        return AnalyticsReport(
            metrics=metrics,
            charts=charts,
            findings=findings,
            analyzer_results=analyzer_results,
        )