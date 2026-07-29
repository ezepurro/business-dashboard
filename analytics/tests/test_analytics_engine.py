import unittest

import pandas as pd

from app.analytics.analytics_engine import AnalyticsEngine
from app.analytics.models.analysis_result import AnalysisResult
from app.analytics.models.analytics_report import AnalyticsReport
from app.analytics.models.business_metric import BusinessMetric
from app.analytics.models.chart_data import ChartData
from app.analytics.models.finding import Finding
from app.analytics.analyzers.base_analyzer import BaseAnalyzer
from app.profiling.models.column_metadata import ColumnMetadata
from app.profiling.models.dataset_metadata import DatasetMetadata


class DummyAnalyzer(BaseAnalyzer):

    def analyze(self, df: pd.DataFrame, metadata: DatasetMetadata) -> AnalysisResult:
        return AnalysisResult(
            metrics=[BusinessMetric(name="dummy", value=1)],
            charts=[ChartData(chart_type="table", title="Dummy")],
            findings=[Finding(title="Dummy finding", description="ok")],
        )


class AnalyticsEngineInfrastructureTests(unittest.TestCase):

    def test_engine_aggregates_analyzer_results(self):
        df = pd.DataFrame({"sales": [10, 20]})
        metadata = DatasetMetadata(
            rows=2,
            columns=1,
            data_dictionary=[
                ColumnMetadata(
                    name="sales",
                    semantic_type="sales",
                    confidence=1.0,
                    dtype="Float64",
                    nullable=False,
                    null_percentage=0.0,
                    unique_values=2,
                    sample_values=[10, 20],
                )
            ],
        )

        report = AnalyticsEngine(analyzers=[DummyAnalyzer()]).analyze(df, metadata)

        self.assertIsInstance(report, AnalyticsReport)
        self.assertEqual(len(report.metrics), 1)
        self.assertEqual(len(report.charts), 1)
        self.assertEqual(len(report.findings), 1)
        self.assertIn("DummyAnalyzer", report.analyzer_results)

    def test_engine_supports_no_analyzers(self):
        df = pd.DataFrame({"sales": [10, 20]})
        metadata = DatasetMetadata(
            rows=2,
            columns=1,
            data_dictionary=[],
        )

        report = AnalyticsEngine(analyzers=[]).analyze(df, metadata)

        self.assertIsInstance(report, AnalyticsReport)
        self.assertEqual(report.metrics, [])
        self.assertEqual(report.charts, [])
        self.assertEqual(report.findings, [])


if __name__ == "__main__":
    unittest.main()