import pandas as pd
from pandas import DataFrame

from app.analytics.analyzers.analysis_utils import numeric_series, safe_linear_trend
from app.analytics.analyzers.base_analyzer import BaseAnalyzer, DATE_SEMANTIC_TYPES
from app.analytics.models.analysis_result import AnalysisResult
from app.analytics.models.business_metric import BusinessMetric
from app.analytics.models.chart_data import ChartData
from app.analytics.models.chart_point import ChartPoint
from app.analytics.models.chart_series import ChartSeries
from app.analytics.models.finding import Finding
from app.analytics.models.time_series_data import TimeSeriesData
from app.analytics.models.time_series_point import TimeSeriesPoint
from app.analytics.models.time_summary import TimeSummary
from app.profiling.models.dataset_metadata import DatasetMetadata


VALUE_SEMANTIC_TYPES = {"sales", "amount", "money", "currency", "numeric_measure", "quantity"}


class TimeAnalyzer(BaseAnalyzer):

    def analyze(
        self,
        df: DataFrame,
        metadata: DatasetMetadata
    ) -> AnalysisResult:

        metrics = []
        charts = []
        findings = []

        date_column = self.first_column_with_semantic_types(metadata, DATE_SEMANTIC_TYPES)
        if date_column is None or date_column not in df.columns:
            return AnalysisResult()

        value_column = self.first_column_with_semantic_types(metadata, VALUE_SEMANTIC_TYPES)

        working = df[[date_column]].copy()
        if value_column and value_column in df.columns:
            working[value_column] = pd.to_numeric(df[value_column], errors="coerce")

        working = working.dropna(subset=[date_column]).sort_values(date_column)

        if working.empty:
            return AnalysisResult()

        if value_column and value_column in working.columns:
            target_label = value_column
        else:
            target_label = "operations"

        series_map = {
            "daily": "D",
            "weekly": "W",
            "monthly": "ME",
            "quarterly": "QE",
            "yearly": "YE",
        }

        summary_kwargs = {
            "date_column": date_column,
            "value_column": value_column,
        }

        primary_series = None
        monthly_values = None

        for label, frequency in series_map.items():
            grouped = self._aggregate_by_frequency(working, date_column, value_column, frequency)
            if grouped.empty:
                continue

            points = self._to_points(grouped)
            time_data = TimeSeriesData(frequency=label, points=points)
            summary_kwargs[label] = time_data

            charts.append(
                ChartData(
                    chart_type="line",
                    title=f"{target_label.title()} by {label}",
                    labels=[point.label for point in points],
                    series=[
                        ChartSeries(
                            name=target_label,
                            points=[ChartPoint(label=point.label, value=point.value) for point in points],
                        )
                    ],
                )
            )

            if primary_series is None:
                primary_series = grouped

            if label == "monthly":
                monthly_values = grouped

        if primary_series is None:
            return AnalysisResult()

        growth_rate = self._growth_rate(monthly_values if monthly_values is not None else primary_series)
        trend_slope = safe_linear_trend(monthly_values if monthly_values is not None else primary_series)
        seasonality_index = self._seasonality_index(monthly_values if monthly_values is not None else primary_series)

        summary = TimeSummary(
            growth_rate=growth_rate,
            trend_slope=trend_slope,
            seasonality_index=seasonality_index,
            **summary_kwargs,
        )

        metrics.append(
            BusinessMetric(
                name="time_summary",
                value=summary,
                column=date_column,
                semantic_type="date",
                confidence=1.0,
                aggregation="temporal_summary",
            )
        )

        if growth_rate is not None:
            findings.append(
                Finding(
                    title="temporal growth detected",
                    description=f"Growth rate for {date_column} is {growth_rate:.2%}.",
                    confidence=growth_rate,
                    related_columns=[date_column],
                )
            )

        return AnalysisResult(metrics=metrics, charts=charts, findings=findings)

    @staticmethod
    def _aggregate_by_frequency(df: DataFrame, date_column: str, value_column: str | None, frequency: str):
        grouped = df.set_index(date_column)
        if value_column and value_column in grouped.columns:
            return grouped[value_column].resample(frequency).sum().dropna()

        return grouped.resample(frequency).size().astype(float)

    @staticmethod
    def _to_points(series: pd.Series) -> list[TimeSeriesPoint]:
        points = []
        previous_value = None

        for label, value in series.items():
            float_value = float(value)
            growth_rate = None
            if previous_value not in (None, 0):
                growth_rate = (float_value - previous_value) / abs(previous_value)

            points.append(
                TimeSeriesPoint(
                    label=str(label.date() if hasattr(label, "date") else label),
                    value=float_value,
                    previous_value=previous_value,
                    growth_rate=growth_rate,
                )
            )
            previous_value = float_value

        return points

    @staticmethod
    def _growth_rate(series: pd.Series) -> float | None:
        cleaned = series.dropna().astype(float)
        if len(cleaned) < 2:
            return None

        first = float(cleaned.iloc[0])
        last = float(cleaned.iloc[-1])
        if first == 0:
            return None

        return (last - first) / abs(first)

    @staticmethod
    def _seasonality_index(series: pd.Series) -> float | None:
        cleaned = series.dropna().astype(float)
        if len(cleaned) < 3:
            return None

        return float(cleaned.std() / cleaned.mean()) if cleaned.mean() != 0 else None

