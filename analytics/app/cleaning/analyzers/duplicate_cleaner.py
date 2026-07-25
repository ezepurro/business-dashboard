from pandas import DataFrame

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.models.cleaning_action import CleaningAction


class DuplicateCleaner(BaseCleaner):

    def analyze(
        self,
        df: DataFrame
    ) -> list[CleaningAction]:

        duplicated = int(df.duplicated().sum())

        if duplicated == 0:
            return []

        return [

            CleaningAction(

                action="remove_duplicates",

                description=f"{duplicated} duplicated rows detected.",

                confidence=1.0,

                automatic=True,

                estimated_affected_rows=duplicated,

                recommendation="Remove duplicated rows."

            )

        ]