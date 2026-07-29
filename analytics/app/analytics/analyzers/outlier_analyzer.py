from pandas import DataFrame

from app.analytics.analyzers.analysis_utils import iqr_bounds, numeric_columns, numeric_series
from app.analytics.analyzers.base_analyzer import BaseAnalyzer
from app.analytics.models.analysis_result import AnalysisResult
from app.analytics.models.business_metric import BusinessMetric
from app.analytics.models.outlier_record import OutlierRecord
from app.analytics.models.outlier_summary import OutlierSummary
from app.profiling.models.dataset_metadata import DatasetMetadata


class OutlierAnalyzer(BaseAnalyzer):

    def analyze(
        self,
        df: DataFrame,
        metadata: DatasetMetadata
    ) -> AnalysisResult:

        metrics = []

        for column in numeric_columns(df):
            series = numeric_series(df[column])
            if series.empty:
                continue

            lower, upper, iqr = iqr_bounds(series)
            if lower is None or upper is None:
                continue

            outliers = []
            for row_index, value in df[column].dropna().items():
                numeric_value = float(value)
                if numeric_value < lower or numeric_value > upper:
                    outliers.append(
                        OutlierRecord(
                            row_index=int(row_index),
                            column=column,
                            value=float(numeric_value),
                            lower_bound=lower,
                            upper_bound=upper,
                            distance=max(lower - numeric_value, numeric_value - upper),
                        )
                    )

            if not outliers:
                continue

            summary = OutlierSummary(
                column=column,
                lower_bound=lower,
                upper_bound=upper,
                outlier_count=len(outliers),
                outliers=outliers,
            )

            metrics.append(
                BusinessMetric(
                    name="outlier_summary",
                    value=summary,
                    column=column,
                    semantic_type="numeric_measure",
                    confidence=1.0,
                    aggregation="outlier_detection",
                )
            )

        return AnalysisResult(metrics=metrics)