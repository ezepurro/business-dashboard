from pandas import DataFrame
from pandas import NA
from pandas.api.types import is_string_dtype

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.models.cleaning_result import CleaningResult


NULL_TOKENS = {
    "",
    "-",
    "n/a",
    "na",
    "null",
    "none",
    "nan",
    "n\\a",
    "nil",
    "s/n",
}


class MissingCleaner(BaseCleaner):

    def clean(
        self,
        df: DataFrame
    ) -> CleaningResult:

        df = df.copy()
        actions = []

        for column in df.columns:

            series = df[column]

            if not (series.dtype == object or is_string_dtype(series)):
                continue

            normalized = series.map(
                lambda value: str(value).strip().lower() if isinstance(value, str) else value
            )

            mask = normalized.isin(NULL_TOKENS)

            affected_rows = int(mask.sum())

            if affected_rows == 0:
                continue

            df.loc[mask, column] = NA

            actions.append(
                self.build_action(
                    action="normalize_nulls",
                    column=column,
                    description="Null-like placeholders were normalized to missing values.",
                    confidence=0.99,
                    estimated_affected_rows=affected_rows,
                    recommendation="Treat these placeholders as missing values.",
                )
            )

        return self.build_result(df, actions)