import pandas as pd


class StructureAnalyzer:

    def analyze(self, df: pd.DataFrame):

        return {
            "rows": len(df),
            "columns": len(df.columns)
        }