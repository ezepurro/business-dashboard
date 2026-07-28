from pandas import DataFrame

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.models.cleaning_result import CleaningResult


class EmptyRowCleaner(BaseCleaner):

    def clean(
        self,
        df: DataFrame
    ) -> CleaningResult:

        normalized = df.replace(r"^\s*$", None, regex=True)
        empty_mask = normalized.isna().all(axis=1)
        empty_rows = int(empty_mask.sum())

        if empty_rows == 0:
            return self.build_result(df.copy(), [])

        cleaned = df.loc[~empty_mask].copy()

        return self.build_result(
            cleaned,
            [
                self.build_action(
                    action="remove_empty_rows",
                    description=f"Removed {empty_rows} completely empty rows.",
                    confidence=1.0,
                    estimated_affected_rows=empty_rows,
                    recommendation="Drop rows that contain no meaningful values.",
                )
            ]
        )