from pandas import DataFrame

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.analyzers.empty_column_cleaner import EmptyColumnCleaner
from app.cleaning.analyzers.empty_row_cleaner import EmptyRowCleaner
from app.cleaning.analyzers.footer_cleaner import FooterCleaner
from app.cleaning.analyzers.missing_cleaner import MissingCleaner
from app.cleaning.analyzers.duplicate_cleaner import DuplicateCleaner
from app.cleaning.analyzers.text_cleaner import TextCleaner
from app.cleaning.analyzers.unnamed_column_cleaner import UnnamedColumnCleaner

from app.cleaning.models.cleaning_report import CleaningReport


class CleaningEngine:

    def __init__(
        self,
        cleaners: list[BaseCleaner] | None = None
    ):

        self.cleaners = cleaners or [
            TextCleaner(),
            MissingCleaner(),
            UnnamedColumnCleaner(),
            EmptyRowCleaner(),
            EmptyColumnCleaner(),
            FooterCleaner(),
            DuplicateCleaner(),
        ]

    def clean(
        self,
        df: DataFrame
    ) -> CleaningReport:

        working_df = df.copy()
        actions = []

        for cleaner in self.cleaners:

            result = cleaner.clean(working_df)

            working_df = result.dataframe

            actions.extend(result.actions)

        return CleaningReport(

            dataframe=working_df,

            actions=actions

        )

    def analyze(
        self,
        df: DataFrame
    ) -> CleaningReport:

        return self.clean(df)