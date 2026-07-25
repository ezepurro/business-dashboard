from pandas import DataFrame

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.models.cleaning_action import CleaningAction


class MissingCleaner(BaseCleaner):

    def analyze(
        self,
        df: DataFrame
    ) -> list[CleaningAction]:

        actions = []

        for column in df.columns:

            percentage = float(df[column].isna().mean())
            
            missing_rows = int(df[column].isna().sum())

            if percentage > 0:

                actions.append(

                    CleaningAction(

                        action="handle_missing",

                        column=column,

                        description=f"Column contains {percentage:.1%} missing values.",

                        confidence=0.95,

                        automatic=False,

                        estimated_affected_rows=missing_rows,

                        recommendation="Review missing values before filling or removing."

                    )

                )

        return actions