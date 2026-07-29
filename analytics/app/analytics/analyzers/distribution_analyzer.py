from pandas import DataFrame

from app.analytics.analyzers.analysis_utils import histogram_items, mode_value, numeric_series, percentile_points
from app.analytics.analyzers.base_analyzer import BaseAnalyzer
from app.analytics.models.analysis_result import AnalysisResult
from app.analytics.models.business_metric import BusinessMetric
from app.analytics.models.chart_data import ChartData
from app.analytics.models.chart_point import ChartPoint
from app.analytics.models.chart_series import ChartSeries
from app.analytics.models.distribution_summary import DistributionSummary
from app.profiling.models.dataset_metadata import DatasetMetadata


class DistributionAnalyzer(BaseAnalyzer):

    def analyze(
        self,
        df: DataFrame,
        metadata: DatasetMetadata
    ) -> AnalysisResult:

        metrics = []
        charts = []

        for column in df.columns:
            series = numeric_series(df[column])
            if series.empty:
                continue

            summary = DistributionSummary(
                column=column,
                count=int(series.count()),
                mean=float(series.mean()),
                median=float(series.median()),
                mode=mode_value(series),
                std_dev=float(series.std()) if series.count() > 1 else None,
                minimum=float(series.min()),
                maximum=float(series.max()),
                q1=float(series.quantile(0.25)),
                q3=float(series.quantile(0.75)),
                iqr=float(series.quantile(0.75) - series.quantile(0.25)),
                skewness=float(series.skew()) if series.count() > 2 else None,
                kurtosis=float(series.kurtosis()) if series.count() > 3 else None,
                percentiles=percentile_points(series, [0.1, 0.25, 0.5, 0.75, 0.9]),
                histogram=histogram_items(series),
            )

            metrics.append(
                BusinessMetric(
                    name="distribution_summary",
                    value=summary,
                    column=column,
                    semantic_type="numeric_measure",
                    confidence=1.0,
                    aggregation="distribution_summary",
                )
            )

            charts.append(
                ChartData(
                    chart_type="histogram",
                    title=f"Distribution of {column}",
                    labels=[item.label for item in summary.histogram],
                    series=[
                        ChartSeries(
                            name=column,
                            points=[ChartPoint(label=item.label, value=item.count, share=item.share) for item in summary.histogram],
                        )
                    ],
                )
            )

        return AnalysisResult(metrics=metrics, charts=charts)