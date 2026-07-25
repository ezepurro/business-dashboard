from pandas import DataFrame

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.models.cleaning_action import CleaningAction


class NormalizationCleaner(BaseCleaner):

    def analyze(
        self,
        df: DataFrame
    ) -> list[CleaningAction]:

        actions = []

        for column in df.select_dtypes(include="object"):

            values = (

                df[column]

                .dropna()

                .astype(str)

                .str.lower()

            )

            unique = values.nunique()

            normalized = values.str.strip().nunique()

            if normalized < unique:

                actions.append(

                    CleaningAction(

                        action="normalize_values",

                        column=column,

                        description="Equivalent values detected with different formatting.",

                        confidence=0.90,

                        automatic=True,

                        estimated_affected_rows=unique - normalized,

                        recommendation="Normalize text values."

                    )

                )

        return actions