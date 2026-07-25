from pandas import DataFrame

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.models.cleaning_action import CleaningAction


class TextCleaner(BaseCleaner):

    def analyze(
        self,
        df: DataFrame
    ) -> list[CleaningAction]:

        actions = []

        for column in df.select_dtypes(include="object"):

            values = df[column].dropna().astype(str)

            if values.empty:
                continue

            mask = (
                values.str.startswith(" ")
                |
                values.str.endswith(" ")
            )

            affected = int(mask.sum())

            if affected == 0:
                continue

            actions.append(

                CleaningAction(

                    action="trim_whitespace",

                    column=column,

                    description="Leading or trailing spaces detected.",

                    confidence=0.98,

                    automatic=True,

                    estimated_affected_rows=affected,

                    recommendation="Trim leading and trailing spaces."

                )

            )

        return actions