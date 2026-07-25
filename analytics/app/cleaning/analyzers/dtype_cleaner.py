from pandas import DataFrame

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.models.cleaning_action import CleaningAction


class DTypeCleaner(BaseCleaner):

    def analyze(
        self,
        df: DataFrame
    ) -> list[CleaningAction]:

        actions = []

        for column in df.columns:

            series = df[column]

            if series.dtype != "object":
                continue

            numeric = series.dropna().astype(str).str.replace(",", ".")

            converted = numeric.str.match(r"^-?\d+(\.\d+)?$")

            if len(converted) and converted.mean() > 0.90:

                actions.append(

                    CleaningAction(

                        action="convert_dtype",

                        column=column,

                        description="Column appears to contain numeric values stored as text.",

                        confidence=0.92,

                        automatic=True,

                        estimated_affected_rows=len(series),

                        recommendation="Convert column to numeric type."

                    )

                )

        return actions