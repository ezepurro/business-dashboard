import pandas as pd


class DtypeAnalyzer:

    def analyze(self, df: pd.DataFrame):

        return {
            col: str(dtype)
            for col, dtype in df.dtypes.items()
        }