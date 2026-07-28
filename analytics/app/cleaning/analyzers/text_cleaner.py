from pandas import DataFrame
from pandas.api.types import is_string_dtype

import re

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.models.cleaning_result import CleaningResult


def _normalize_text(value):
    if not isinstance(value, str):
        return value

    return re.sub(r"\s+", " ", value).strip()


class TextCleaner(BaseCleaner):

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

            normalized = series.map(_normalize_text)

            changed_mask = series.ne(normalized) & series.notna()

            affected_rows = int(changed_mask.sum())

            if affected_rows == 0:
                continue

            df[column] = normalized

            actions.append(
                self.build_action(
                    action="trim_and_normalize_spaces",
                    column=column,
                    description="Leading, trailing, or repeated spaces were normalized.",
                    confidence=0.98,
                    estimated_affected_rows=affected_rows,
                    recommendation="Keep a single space between words and trim boundary spaces.",
                )

            )
        return self.build_result(df, actions)
        return actions