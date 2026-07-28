from pandas import DataFrame

from app.cleaning.analyzers.base_cleaner import BaseCleaner
from app.cleaning.models.cleaning_result import CleaningResult


class NormalizationCleaner(BaseCleaner):

    def clean(
        self,
        df: DataFrame
    ) -> CleaningResult:

        return self.build_result(df.copy(), [])