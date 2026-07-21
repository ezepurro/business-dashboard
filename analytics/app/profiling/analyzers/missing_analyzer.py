import pandas as pd


class MissingAnalyzer:

    def analyze(self, df: pd.DataFrame):

        return df.isnull().sum().to_dict()