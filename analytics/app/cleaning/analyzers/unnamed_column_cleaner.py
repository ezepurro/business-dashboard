from pandas import DataFrame

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.models.cleaning_result import CleaningResult


class UnnamedColumnCleaner(BaseCleaner):

    def clean(
        self,
        df: DataFrame
    ) -> CleaningResult:

        unnamed_columns = [
            column
            for column in df.columns
            if not str(column).strip() or str(column).strip().lower().startswith("unnamed")
        ]

        if not unnamed_columns:
            return self.build_result(df.copy(), [])

        cleaned = df.drop(columns=unnamed_columns).copy()
        affected_rows = len(df)

        actions = [
            self.build_action(
                action="remove_unnamed_columns",
                column=column,
                description="Removed a pandas-generated Unnamed column.",
                confidence=1.0,
                estimated_affected_rows=affected_rows,
                recommendation="Drop imported index artifacts and empty header placeholders.",
            )
            for column in unnamed_columns
        ]

        return self.build_result(cleaned, actions)