from pandas import DataFrame

from app.cleaning.analyzers.missing_cleaner import MissingCleaner
from app.cleaning.analyzers.duplicate_cleaner import DuplicateCleaner
from app.cleaning.analyzers.text_cleaner import TextCleaner
from app.cleaning.analyzers.normalization_cleaner import NormalizationCleaner
from app.cleaning.analyzers.dtype_cleaner import DTypeCleaner

from app.cleaning.models.cleaning_report import CleaningReport


class CleaningEngine:

    def __init__(self):

        self.cleaners = [

            MissingCleaner(),

            DuplicateCleaner(),

            TextCleaner(),

            NormalizationCleaner(),

            DTypeCleaner()

        ]

    def analyze(
        self,
        df: DataFrame
    ) -> CleaningReport:

        actions = []

        for cleaner in self.cleaners:

            actions.extend(

                cleaner.analyze(df)

            )

        actions.sort(

            key=lambda action: (

                action.confidence,

                action.estimated_affected_rows or 0

            ),

            reverse=True

        )

        return CleaningReport(

            actions=actions

        )