from pandas import DataFrame

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.models.cleaning_result import CleaningResult


FOOTER_KEYWORDS = {
    "total",
    "total general",
    "subtotal",
    "grand total",
    "sum",
    "totales",
}


class FooterCleaner(BaseCleaner):

    def clean(
        self,
        df: DataFrame
    ) -> CleaningResult:

        if df.empty:
            return self.build_result(df.copy(), [])

        footer_start = len(df)
        best_score = 0.0

        for index in range(len(df) - 1, -1, -1):

            row = df.iloc[index].tolist()
            values = [
                str(value).strip().lower()
                for value in row
                if value not in (None, "")
            ]

            if not values:
                continue

            score = 0.0

            if any(value in FOOTER_KEYWORDS for value in values):
                score += 0.6

            empty_ratio = sum(value in (None, "") for value in row) / len(row)

            if empty_ratio >= 0.6:
                score += 0.2

            if index >= len(df) * 0.8:
                score += 0.2

            if score > best_score:
                best_score = score
                footer_start = index

        if footer_start == len(df) or best_score < 0.6:
            return self.build_result(df.copy(), [])

        cleaned = df.iloc[:footer_start].copy()
        affected_rows = len(df) - footer_start

        return self.build_result(
            cleaned,
            [
                self.build_action(
                    action="remove_footer_rows",
                    description=f"Removed {affected_rows} residual footer rows.",
                    confidence=best_score,
                    estimated_affected_rows=affected_rows,
                    recommendation="Keep only rows that belong to the main dataset table.",
                )
            ]
        )