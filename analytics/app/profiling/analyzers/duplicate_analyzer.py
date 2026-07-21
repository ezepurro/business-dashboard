import pandas as pd


class DuplicateAnalyzer:

    def analyze(self, df: pd.DataFrame):

        return int(df.duplicated().sum())