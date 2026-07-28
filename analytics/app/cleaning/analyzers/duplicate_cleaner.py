from pandas import DataFrame

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.models.cleaning_result import CleaningResult


class DuplicateCleaner(BaseCleaner):

    def clean(
        self,
        df: DataFrame
    ) -> CleaningResult:

        df = df.copy()
        duplicated_mask = df.duplicated()
        duplicated_rows = int(duplicated_mask.sum())

        if duplicated_rows == 0:
            return self.build_result(df, [])

        cleaned = df.loc[~duplicated_mask].copy()

        return self.build_result(
            cleaned,
            [
                self.build_action(
                    action="remove_duplicates",
                    description=f"Removed {duplicated_rows} duplicated rows.",
                    confidence=1.0,
                    estimated_affected_rows=duplicated_rows,
                    recommendation="Remove exact duplicated rows.",
                )
            ]
        )