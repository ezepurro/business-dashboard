from pandas import DataFrame


class UniquenessAnalyzer:

    def analyze(
        self,
        df: DataFrame
    ) -> float:

        if len(df) == 0:
            return 100

        duplicated = int(df.duplicated().sum())

        return round((1 - duplicated / len(df)) * 100, 2)