import pandas as pd


class SampleAnalyzer:

    def analyze(
        self,
        df: pd.DataFrame
    ):

        return df.head(5).to_dict(
            orient="records"
        )