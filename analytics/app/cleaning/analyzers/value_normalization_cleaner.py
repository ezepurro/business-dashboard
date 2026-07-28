import re

from pandas import DataFrame
from pandas.api.types import is_string_dtype

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.models.cleaning_result import CleaningResult


TEXT_NORMALIZATIONS: dict[str, str] = {
    "si": "Si",
    "sí": "Si",
    "no": "No",
    "true": "True",
    "false": "False",
    "mercado pago": "Mercado Pago",
}


def _normalize_value(value: str) -> str:
    compact = re.sub(r"\s+", " ", value).strip()
    lower = compact.casefold()

    if lower in TEXT_NORMALIZATIONS:
        return TEXT_NORMALIZATIONS[lower]

    return compact.title()


class ValueNormalizationCleaner(BaseCleaner):

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
                lambda value: _normalize_value(value) if isinstance(value, str) else value
            )

            changed_mask = series.ne(normalized) & series.notna()
            affected_rows = int(changed_mask.sum())

            if affected_rows == 0:
                continue

            df[column] = normalized

            actions.append(
                self.build_action(
                    action="normalize_text_values",
                    column=column,
                    description="Text values were normalized without changing their data type.",
                    confidence=0.93,
                    estimated_affected_rows=affected_rows,
                    recommendation="Keep textual labels consistent before semantic transformation.",
                )
            )

        return self.build_result(df, actions)