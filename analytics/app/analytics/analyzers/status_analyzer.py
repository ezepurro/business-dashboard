from pandas import DataFrame

from app.analytics.analyzers.analysis_utils import distribution_items, entropy
from app.analytics.analyzers.base_analyzer import BaseAnalyzer
from app.analytics.models.analysis_result import AnalysisResult
from app.analytics.models.business_metric import BusinessMetric
from app.analytics.models.category_summary import CategorySummary
from app.profiling.models.dataset_metadata import DatasetMetadata


class StatusAnalyzer(BaseAnalyzer):

    def analyze(
        self,
        df: DataFrame,
        metadata: DatasetMetadata
    ) -> AnalysisResult:

        metrics = []

        for column in self.columns_with_semantic_types(metadata, {"status"}):
            if column not in df.columns:
                continue

            values = df[column].dropna()
            if values.empty:
                continue

            distribution = distribution_items(values)
            dominant = distribution[0] if distribution else None

            summary = CategorySummary(
                column=column,
                category_count=int(values.nunique(dropna=True)),
                dominant_category=dominant.label if dominant else None,
                dominant_percentage=dominant.share if dominant else None,
                distribution=distribution,
                entropy=entropy(values),
            )

            metrics.append(
                BusinessMetric(
                    name="status_summary",
                    value=summary,
                    column=column,
                    semantic_type="status",
                    confidence=1.0,
                    aggregation="status_distribution",
                )
            )

        return AnalysisResult(metrics=metrics)