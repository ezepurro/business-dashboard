import unittest

import pandas as pd

from app.analytics.analytics_engine import AnalyticsEngine
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
from app.profiling.models.column_metadata import ColumnMetadata
from app.profiling.models.dataset_metadata import DatasetMetadata


def build_metadata(df: pd.DataFrame, semantic_types: dict[str, str]) -> DatasetMetadata:
    return DatasetMetadata(
        rows=len(df),
        columns=len(df.columns),
        data_dictionary=[
            ColumnMetadata(
                name=column,
                semantic_type=semantic_types.get(column, "unknown"),
                confidence=1.0,
                dtype=str(df[column].dtype),
                nullable=bool(df[column].isna().any()),
                null_percentage=float(df[column].isna().mean()),
                unique_values=int(df[column].nunique(dropna=True)),
                sample_values=df[column].dropna().head(5).tolist(),
            )
            for column in df.columns
        ],
    )


class AnalyticsAnalyzerTests(unittest.TestCase):

    def test_sales_analyzer(self):
        df = pd.DataFrame({"sales": [100.0, 150.0, 200.0, 50.0]})
        metadata = build_metadata(df, {"sales": "sales"})

        result = SalesAnalyzer().analyze(df, metadata)

        self.assertEqual(len(result.metrics), 1)
        summary = result.metrics[0].value
        self.assertEqual(summary.total_sales, 500.0)
        self.assertEqual(summary.operation_count, 4)
        self.assertEqual(summary.column, "sales")

    def test_time_analyzer(self):
        df = pd.DataFrame(
            {
                "fecha": pd.to_datetime(["2025-01-01", "2025-01-02", "2025-02-01", "2025-02-02"]),
                "sales": [100.0, 150.0, 200.0, 250.0],
            }
        )
        metadata = build_metadata(df, {"fecha": "date", "sales": "sales"})

        result = TimeAnalyzer().analyze(df, metadata)

        self.assertEqual(len(result.metrics), 1)
        summary = result.metrics[0].value
        self.assertEqual(summary.date_column, "fecha")
        self.assertIsNotNone(summary.monthly)
        self.assertGreater(len(result.charts), 0)

    def test_product_analyzer(self):
        df = pd.DataFrame(
            {
                "producto": ["A", "A", "B", "C", "C", "C"],
                "sales": [10, 20, 30, 40, 50, 60],
                "cantidad": [1, 2, 1, 1, 1, 2],
            }
        )
        metadata = build_metadata(df, {"producto": "product", "sales": "sales", "cantidad": "quantity"})

        result = ProductAnalyzer().analyze(df, metadata)

        self.assertEqual(len(result.metrics), 1)
        summary = result.metrics[0].value
        self.assertEqual(summary.entity_type, "product")
        self.assertEqual(summary.unique_count, 3)
        self.assertGreater(len(summary.top_items), 0)

    def test_customer_analyzer(self):
        df = pd.DataFrame(
            {
                "cliente": ["Ana", "Ana", "Luis", "Marta", "Marta", "Marta"],
                "sales": [10, 20, 30, 40, 50, 60],
            }
        )
        metadata = build_metadata(df, {"cliente": "customer", "sales": "sales"})

        result = CustomerAnalyzer().analyze(df, metadata)

        self.assertEqual(len(result.metrics), 1)
        summary = result.metrics[0].value
        self.assertEqual(summary.entity_type, "customer")
        self.assertEqual(summary.unique_count, 3)
        self.assertGreater(summary.recurrence_rate, 0)

    def test_distribution_analyzer(self):
        df = pd.DataFrame({"a": [1, 2, 3, 4, 100], "b": [10, 20, 30, 40, 50]})
        metadata = build_metadata(df, {"a": "numeric_measure", "b": "numeric_measure"})

        result = DistributionAnalyzer().analyze(df, metadata)

        self.assertEqual(len(result.metrics), 2)
        self.assertEqual(len(result.charts), 2)
        self.assertEqual(result.metrics[0].value.column, "a")

    def test_correlation_analyzer(self):
        df = pd.DataFrame(
            {
                "x": [1, 2, 3, 4, 5],
                "y": [2, 4, 6, 8, 10],
                "z": [10, 8, 6, 4, 2],
            }
        )
        metadata = build_metadata(df, {"x": "numeric_measure", "y": "numeric_measure", "z": "numeric_measure"})

        result = CorrelationAnalyzer().analyze(df, metadata)

        self.assertEqual(len(result.metrics), 1)
        summary = result.metrics[0].value
        self.assertEqual(summary.columns, ["x", "y", "z"])
        self.assertGreater(len(summary.strong_correlations), 0)
        self.assertGreater(len(summary.strong_negative_correlations), 0)

    def test_outlier_analyzer(self):
        df = pd.DataFrame({"valor": [10, 11, 12, 13, 1000]})
        metadata = build_metadata(df, {"valor": "numeric_measure"})

        result = OutlierAnalyzer().analyze(df, metadata)

        self.assertEqual(len(result.metrics), 1)
        summary = result.metrics[0].value
        self.assertEqual(summary.column, "valor")
        self.assertGreater(summary.outlier_count, 0)

    def test_category_analyzer(self):
        df = pd.DataFrame({"estado": ["Activo", "Activo", "Inactivo", "Activo"]})
        metadata = build_metadata(df, {"estado": "categorical"})

        result = CategoryAnalyzer().analyze(df, metadata)

        self.assertEqual(len(result.metrics), 1)
        summary = result.metrics[0].value
        self.assertEqual(summary.dominant_category, "Activo")
        self.assertGreater(summary.category_count, 0)

    def test_geographic_analyzer(self):
        df = pd.DataFrame({"region": ["Norte", "Sur", "Norte", "Centro"]})
        metadata = build_metadata(df, {"region": "region"})

        result = GeographicAnalyzer().analyze(df, metadata)

        self.assertEqual(len(result.metrics), 1)
        summary = result.metrics[0].value
        self.assertEqual(summary.column, "region")
        self.assertEqual(summary.dominant_category, "Norte")

    def test_payment_analyzer(self):
        df = pd.DataFrame({"pago": ["Mercado Pago", "Mercado Pago", "Transferencia"]})
        metadata = build_metadata(df, {"pago": "payment_method"})

        result = PaymentAnalyzer().analyze(df, metadata)

        self.assertEqual(len(result.metrics), 1)
        summary = result.metrics[0].value
        self.assertEqual(summary.dominant_category, "Mercado Pago")

    def test_status_analyzer(self):
        df = pd.DataFrame({"estado": ["Activo", "Inactivo", "Activo", "Activo"]})
        metadata = build_metadata(df, {"estado": "status"})

        result = StatusAnalyzer().analyze(df, metadata)

        self.assertEqual(len(result.metrics), 1)
        summary = result.metrics[0].value
        self.assertEqual(summary.dominant_category, "Activo")

    def test_default_engine_runs_all_analyzers(self):
        df = pd.DataFrame(
            {
                "sales": [100.0, 150.0, 200.0, 50.0],
                "fecha": pd.to_datetime(["2025-01-01", "2025-01-02", "2025-02-01", "2025-02-02"]),
                "producto": ["A", "A", "B", "C"],
                "cliente": ["Ana", "Ana", "Luis", "Marta"],
                "valor": [10, 11, 12, 1000],
                "estado": ["Activo", "Inactivo", "Activo", "Activo"],
                "region": ["Norte", "Sur", "Norte", "Centro"],
                "pago": ["Mercado Pago", "Transferencia", "Mercado Pago", "Mercado Pago"],
            }
        )
        metadata = build_metadata(
            df,
            {
                "sales": "sales",
                "fecha": "date",
                "producto": "product",
                "cliente": "customer",
                "valor": "numeric_measure",
                "estado": "status",
                "region": "region",
                "pago": "payment_method",
            },
        )

        report = AnalyticsEngine().analyze(df, metadata)

        self.assertIsInstance(report, AnalyticsReport)
        self.assertGreater(len(report.metrics), 0)
        self.assertIn("SalesAnalyzer", report.analyzer_results)
        self.assertIn("TimeAnalyzer", report.analyzer_results)
        self.assertIn("ProductAnalyzer", report.analyzer_results)
        self.assertIn("CustomerAnalyzer", report.analyzer_results)
        self.assertIn("DistributionAnalyzer", report.analyzer_results)
        self.assertIn("CorrelationAnalyzer", report.analyzer_results)
        self.assertIn("OutlierAnalyzer", report.analyzer_results)
        self.assertIn("CategoryAnalyzer", report.analyzer_results)
        self.assertIn("GeographicAnalyzer", report.analyzer_results)
        self.assertIn("PaymentAnalyzer", report.analyzer_results)
        self.assertIn("StatusAnalyzer", report.analyzer_results)


if __name__ == "__main__":
    unittest.main()