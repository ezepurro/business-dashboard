from pandas import DataFrame


class CompletenessAnalyzer:

    def analyze(
        self,
        df: DataFrame
    ) -> float:

        total = df.size

        if total == 0:
            return 100

        missing = int(df.isna().sum().sum())

        return round((1 - missing / total) * 100, 2)