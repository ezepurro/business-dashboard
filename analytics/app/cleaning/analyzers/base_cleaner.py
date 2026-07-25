from abc import ABC, abstractmethod

from pandas import DataFrame

from app.cleaning.models.cleaning_action import CleaningAction


class BaseCleaner(ABC):

    @abstractmethod
    def analyze(
        self,
        df: DataFrame
    ) -> list[CleaningAction]:
        pass