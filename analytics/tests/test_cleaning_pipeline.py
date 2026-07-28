import unittest

import pandas as pd
from pandas.testing import assert_frame_equal

from app.cleaning.analyzers.duplicate_cleaner import DuplicateCleaner
from app.cleaning.analyzers.empty_column_cleaner import EmptyColumnCleaner
from app.cleaning.analyzers.empty_row_cleaner import EmptyRowCleaner
from app.cleaning.analyzers.footer_cleaner import FooterCleaner
from app.cleaning.analyzers.missing_cleaner import MissingCleaner
from app.cleaning.analyzers.text_cleaner import TextCleaner
from app.cleaning.analyzers.unnamed_column_cleaner import UnnamedColumnCleaner
from app.cleaning.cleaning_engine import CleaningEngine
from app.cleaning.models.cleaning_report import CleaningReport
from app.profiling.profiler import DatasetProfiler


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

    def test_cleaning_engine_runs_cleaners_in_sequence(self):
        df = pd.DataFrame(
            {
                "Unnamed: 0": [1, 2, 3, 4],
                "customer": ["  Alice  ", "Alice", None, "Total General"],
                "region": [" North ", "North", None, None],
                "status": ["N/A", "-", None, None],
                "empty": [None, None, None, None],
            }
        )

        report = CleaningEngine().clean(df)

        self.assertIsInstance(report, CleaningReport)
        self.assertListEqual(list(report.dataframe.columns), ["customer", "region"])
        self.assertEqual(len(report.dataframe), 1)
        self.assertEqual(report.dataframe.iloc[0]["customer"], "Alice")
        self.assertEqual(report.dataframe.iloc[0]["region"], "North")

        actions = [action.action for action in report.actions]
        self.assertIn("trim_and_normalize_spaces", actions)
        self.assertIn("normalize_nulls", actions)
        self.assertIn("remove_empty_rows", actions)
        self.assertIn("remove_unnamed_columns", actions)
        self.assertIn("remove_empty_columns", actions)
        self.assertIn("remove_footer_rows", actions)
        self.assertIn("remove_duplicates", actions)

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


if __name__ == "__main__":
    unittest.main()