from pandas import DataFrame

from app.analytics.analyzers.analysis_utils import distribution_items, entropy
from app.analytics.analyzers.base_analyzer import BaseAnalyzer, GEOGRAPHIC_SEMANTIC_TYPES
from app.analytics.models.analysis_result import AnalysisResult
from app.analytics.models.business_metric import BusinessMetric
from app.analytics.models.category_summary import CategorySummary
from app.profiling.models.dataset_metadata import DatasetMetadata


class GeographicAnalyzer(BaseAnalyzer):

    def analyze(
        self,
        df: DataFrame,
        metadata: DatasetMetadata
    ) -> AnalysisResult:

        metrics = []

        metadata_map = self.metadata_map(metadata)

        for column in self.columns_with_semantic_types(metadata, GEOGRAPHIC_SEMANTIC_TYPES):
            if column not in df.columns:
                continue

            column_metadata = metadata_map.get(column)
            if column_metadata is None:
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
                    name="geographic_summary",
                    value=summary,
                    column=column,
                    semantic_type=column_metadata.semantic_type,
                    confidence=1.0,
                    aggregation="geographic_distribution",
                )
            )

        return AnalysisResult(metrics=metrics)