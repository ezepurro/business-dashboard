from pandas import DataFrame

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.models.cleaning_result import CleaningResult


class EmptyColumnCleaner(BaseCleaner):

    def clean(
        self,
        df: DataFrame
    ) -> CleaningResult:

        normalized = df.replace(r"^\s*$", None, regex=True)
        empty_columns = [
            column
            for column in normalized.columns
            if normalized[column].isna().all()
        ]

        if not empty_columns:
            return self.build_result(df.copy(), [])

        cleaned = df.drop(columns=empty_columns).copy()
        affected_rows = len(df)

        actions = [
            self.build_action(
                action="remove_empty_columns",
                column=column,
                description="Removed a completely empty column.",
                confidence=1.0,
                estimated_affected_rows=affected_rows,
                recommendation="Drop columns that contain no meaningful values.",
            )
            for column in empty_columns
        ]

        return self.build_result(cleaned, actions)