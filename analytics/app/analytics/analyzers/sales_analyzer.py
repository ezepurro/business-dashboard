from pandas import DataFrame

from app.analytics.analyzers.analysis_utils import numeric_series, percentile_points
from app.analytics.analyzers.base_analyzer import BaseAnalyzer
from app.analytics.models.analysis_result import AnalysisResult
from app.analytics.models.business_metric import BusinessMetric
from app.analytics.models.sales_summary import SalesSummary
from app.profiling.models.dataset_metadata import DatasetMetadata


SALES_SEMANTIC_TYPES = {"sales", "amount", "money", "currency"}


class SalesAnalyzer(BaseAnalyzer):

    def analyze(
        self,
        df: DataFrame,
        metadata: DatasetMetadata
    ) -> AnalysisResult:

        metrics = []
        columns = self.columns_with_semantic_types(metadata, SALES_SEMANTIC_TYPES)

        for column in columns:
            if column not in df.columns:
                continue

            series = numeric_series(df[column])
            if series.empty:
                continue

            total_sales = float(series.sum())
            operation_count = int(series.count())
            mean_value = float(series.mean())

            summary = SalesSummary(
                column=column,
                total_sales=total_sales,
                operation_count=operation_count,
                average_ticket=mean_value,
                median=float(series.median()),
                mean=mean_value,
                std_dev=float(series.std()) if operation_count > 1 else None,
                minimum=float(series.min()),
                maximum=float(series.max()),
                percentiles=percentile_points(series, [0.1, 0.25, 0.5, 0.75, 0.9]),
            )

            metrics.append(
                BusinessMetric(
                    name="sales_summary",
                    value=summary,
                    column=column,
                    semantic_type="sales",
                    confidence=1.0,
                    aggregation="summary",
                    tags=["sales", "revenue"],
                )
            )

        return AnalysisResult(metrics=metrics)