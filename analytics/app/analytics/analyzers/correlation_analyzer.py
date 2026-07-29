from pandas import DataFrame

from app.analytics.analyzers.analysis_utils import correlation_pairs, numeric_columns
from app.analytics.analyzers.base_analyzer import BaseAnalyzer
from app.analytics.models.analysis_result import AnalysisResult
from app.analytics.models.business_metric import BusinessMetric
from app.analytics.models.correlation_summary import CorrelationSummary
from app.profiling.models.dataset_metadata import DatasetMetadata


class CorrelationAnalyzer(BaseAnalyzer):

    def analyze(
        self,
        df: DataFrame,
        metadata: DatasetMetadata
    ) -> AnalysisResult:

        columns = numeric_columns(df)
        if len(columns) < 2:
            return AnalysisResult()

        correlation = df[columns].corr(numeric_only=True).fillna(0.0)
        strong, negative = correlation_pairs(correlation)

        summary = CorrelationSummary(
            columns=columns,
            matrix=correlation.values.tolist(),
            strong_correlations=strong,
            strong_negative_correlations=negative,
        )

        return AnalysisResult(
            metrics=[
                BusinessMetric(
                    name="correlation_summary",
                    value=summary,
                    semantic_type="numeric_measure",
                    confidence=1.0,
                    aggregation="correlation",
                )
            ]
        )