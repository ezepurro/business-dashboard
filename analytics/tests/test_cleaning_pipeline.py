import unittest

import pandas as pd
from pandas.testing import assert_frame_equal

from app.cleaning.analyzers.duplicate_cleaner import DuplicateCleaner
from app.cleaning.analyzers.empty_column_cleaner import EmptyColumnCleaner
from app.cleaning.analyzers.empty_row_cleaner import EmptyRowCleaner
from app.cleaning.analyzers.footer_cleaner import FooterCleaner
from app.cleaning.analyzers.missing_cleaner import MissingCleaner
from app.cleaning.analyzers.text_cleaner import TextCleaner
from app.cleaning.analyzers.value_normalization_cleaner import ValueNormalizationCleaner
from app.cleaning.analyzers.unnamed_column_cleaner import UnnamedColumnCleaner
from app.cleaning.cleaning_engine import CleaningEngine
from app.cleaning.models.cleaning_report import CleaningReport
from app.profiling.profiler import DatasetProfiler
from app.transformation.models.transformation_report import TransformationReport


class CleaningPipelineTests(unittest.TestCase):

    def test_missing_cleaner_normalizes_null_like_tokens(self):
        df = pd.DataFrame(
            {
                "status": ["N/A", " ok ", "NULL", "-", None],
            }
        )

        result = MissingCleaner().clean(df)

        self.assertTrue(pd.isna(result.dataframe.loc[0, "status"]))
        self.assertTrue(pd.isna(result.dataframe.loc[2, "status"]))
        self.assertTrue(pd.isna(result.dataframe.loc[3, "status"]))
        self.assertEqual(result.actions[0].action, "normalize_nulls")
        self.assertEqual(result.actions[0].estimated_affected_rows, 3)

    def test_text_cleaner_trims_and_collapses_spaces(self):
        df = pd.DataFrame(
            {
                "customer": ["  Alice   Smith  ", "Bob", None],
            }
        )

        result = TextCleaner().clean(df)

        self.assertEqual(result.dataframe.loc[0, "customer"], "Alice Smith")
        self.assertEqual(result.dataframe.loc[1, "customer"], "Bob")
        self.assertTrue(pd.isna(result.dataframe.loc[2, "customer"]))
        self.assertEqual(result.actions[0].action, "trim_and_normalize_spaces")
        self.assertEqual(result.actions[0].estimated_affected_rows, 1)

    def test_empty_row_cleaner_removes_rows_without_values(self):
        df = pd.DataFrame(
            {
                "a": [1, None, ""],
                "b": [None, None, "   "],
            }
        )

        result = EmptyRowCleaner().clean(df)

        self.assertEqual(len(result.dataframe), 1)
        self.assertEqual(result.dataframe.iloc[0]["a"], 1)
        self.assertEqual(result.actions[0].action, "remove_empty_rows")
        self.assertEqual(result.actions[0].estimated_affected_rows, 2)

    def test_empty_column_cleaner_removes_columns_without_values(self):
        df = pd.DataFrame(
            {
                "filled": [1, 2],
                "empty": [None, "   "],
            }
        )

        result = EmptyColumnCleaner().clean(df)

        self.assertListEqual(list(result.dataframe.columns), ["filled"])
        self.assertEqual(result.actions[0].action, "remove_empty_columns")
        self.assertEqual(result.actions[0].column, "empty")

    def test_unnamed_column_cleaner_removes_pandas_artifacts(self):
        df = pd.DataFrame(
            {
                "Unnamed: 0": [1, 2],
                "name": ["Alice", "Bob"],
            }
        )

        result = UnnamedColumnCleaner().clean(df)

        self.assertListEqual(list(result.dataframe.columns), ["name"])
        self.assertEqual(result.actions[0].action, "remove_unnamed_columns")
        self.assertEqual(result.actions[0].column, "Unnamed: 0")

    def test_duplicate_cleaner_removes_exact_duplicates(self):
        df = pd.DataFrame(
            {
                "name": ["Alice", "Alice", "Bob"],
                "value": [1, 1, 2],
            }
        )

        result = DuplicateCleaner().clean(df)

        self.assertEqual(len(result.dataframe), 2)
        self.assertEqual(result.actions[0].action, "remove_duplicates")
        self.assertEqual(result.actions[0].estimated_affected_rows, 1)

    def test_footer_cleaner_removes_residual_footer_rows(self):
        df = pd.DataFrame(
            {
                "label": ["Revenue", "Costs", "Total General"],
                "amount": [100, 60, None],
            }
        )

        result = FooterCleaner().clean(df)

        self.assertEqual(len(result.dataframe), 2)
        self.assertEqual(result.actions[0].action, "remove_footer_rows")
        self.assertEqual(result.actions[0].estimated_affected_rows, 1)

    def test_value_normalization_cleaner_normalizes_text_without_changing_dtype(self):
        df = pd.DataFrame(
            {
                "Cliente Fidelizado": ["SI", "no", "TRUE", "false", "MERCADO PAGO", "  juan   perez "],
                "Otro": ["Sí", "No", "Mercado Pago", None, "  ACME  SA  ", "alpha beta"],
            }
        )

        result = ValueNormalizationCleaner().clean(df)

        self.assertListEqual(
            result.dataframe["Cliente Fidelizado"].tolist(),
            ["Si", "No", "True", "False", "Mercado Pago", "Juan Perez"]
        )
        self.assertEqual(result.dataframe.loc[0, "Otro"], "Si")
        self.assertEqual(result.dataframe.loc[1, "Otro"], "No")
        self.assertEqual(result.dataframe.loc[2, "Otro"], "Mercado Pago")
        self.assertTrue(pd.isna(result.dataframe.loc[3, "Otro"]))
        self.assertEqual(result.dataframe.loc[4, "Otro"], "Acme Sa")
        self.assertEqual(result.dataframe.loc[5, "Otro"], "Alpha Beta")
        self.assertEqual(result.actions[0].action, "normalize_text_values")
        self.assertEqual(result.actions[0].column, "Cliente Fidelizado")

    def test_cleaning_engine_runs_cleaners_in_sequence(self):
        df = pd.DataFrame(
            {
                "Unnamed: 0": [1, 2, 3, 4],
                "customer": ["  Alice  ", "Alice", None, "Total General"],
                "region": [" North ", "North", None, None],
                "status": ["N/A", "-", None, None],
                "Cliente Fidelizado": ["SI", "no", None, "TRUE"],
                "empty": [None, None, None, None],
            }
        )

        report = CleaningEngine().clean(df)

        self.assertIsInstance(report, CleaningReport)
        self.assertListEqual(list(report.dataframe.columns), ["customer", "region", "Cliente Fidelizado"])
        self.assertEqual(len(report.dataframe), 2)
        self.assertEqual(report.dataframe.iloc[0]["customer"], "Alice")
        self.assertEqual(report.dataframe.iloc[0]["region"], "North")
        self.assertEqual(report.dataframe.iloc[0]["Cliente Fidelizado"], "Si")
        self.assertEqual(report.dataframe.iloc[1]["Cliente Fidelizado"], "No")

        actions = [action.action for action in report.actions]
        self.assertIn("trim_and_normalize_spaces", actions)
        self.assertIn("normalize_nulls", actions)
        self.assertIn("normalize_text_values", actions)
        self.assertIn("remove_empty_rows", actions)
        self.assertIn("remove_unnamed_columns", actions)
        self.assertIn("remove_empty_columns", actions)
        self.assertIn("remove_footer_rows", actions)

    def test_profiler_uses_provided_cleaning_report(self):
        raw_df = pd.DataFrame(
            {
                "customer": ["  Alice  "],
                "region": [" North "],
            }
        )
        cleaned_df = pd.DataFrame(
            {
                "customer": ["Alice"],
                "region": ["North"],
            }
        )

        profiler = DatasetProfiler()
        profiler.cleaning.clean = lambda _df: self.fail("CleaningEngine should not be called when a CleaningReport is provided")

        profile = profiler.profile(
            raw_df,
            cleaning_report=CleaningReport(dataframe=cleaned_df, actions=[])
        )

        self.assertEqual(profile.rows, 1)
        self.assertEqual(profile.columns, 2)
        self.assertEqual(profile.cleaning.dataframe.iloc[0]["customer"], "Alice")
        self.assertIn("\"dataframe\"", profile.model_dump_json())

    def test_profile_serialization_normalizes_nan_and_datetime_values(self):
        df = pd.DataFrame(
            {
                "Fecha": pd.to_datetime(["2025-01-01", "2025-01-02"]),
                "Observaciones": ["ok", float("nan")],
            }
        )

        profiler = DatasetProfiler()
        profile = profiler.profile(
            df,
            cleaning_report=CleaningReport(dataframe=df, actions=[])
        )
        profile.transformation = TransformationReport(dataframe=df, actions=[])

        serialized = profile.model_dump_json()

        self.assertIn('"Observaciones":null', serialized)
        self.assertIn('"2025-01-01T00:00:00"', serialized)


if __name__ == "__main__":
    unittest.main()