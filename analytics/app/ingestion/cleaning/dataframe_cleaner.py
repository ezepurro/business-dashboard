from pandas import DataFrame


class DataFrameCleaner:

    @staticmethod
    def remove_empty_rows(
        df: DataFrame
    ) -> DataFrame:
        """
        Removes rows that are completely empty.

        Empty strings and whitespace-only values are treated as nulls.
        """

        df = df.replace(
            r"^\s*$",
            None,
            regex=True
        )

        return df.dropna(
            how="all"
        )

    @staticmethod
    def remove_empty_columns(
        df: DataFrame
    ) -> DataFrame:
        """
        Removes columns that are completely empty.
        """

        df = df.replace(
            r"^\s*$",
            None,
            regex=True
        )

        return df.dropna(
            axis=1,
            how="all"
        )

    @staticmethod
    def clean(
        df: DataFrame
    ) -> DataFrame:
        """
        Executes the default ingestion cleaning pipeline.
        """

        df = DataFrameCleaner.remove_empty_rows(df)

        df = DataFrameCleaner.remove_empty_columns(df)

        return df