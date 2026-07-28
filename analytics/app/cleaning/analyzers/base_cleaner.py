from abc import ABC, abstractmethod

from pandas import DataFrame

from app.cleaning.models.cleaning_action import CleaningAction
from app.cleaning.models.cleaning_result import CleaningResult


class BaseCleaner(ABC):

    @abstractmethod
    def clean(
        self,
        df: DataFrame
    ) -> CleaningResult:
        pass

    def analyze(
        self,
        df: DataFrame
    ) -> list[CleaningAction]:
        return self.clean(df).actions

    @staticmethod
    def build_action(
        action: str,
        description: str,
        confidence: float,
        column: str | None = None,
        automatic: bool = True,
        estimated_affected_rows: int | None = None,
        recommendation: str | None = None,
    ) -> CleaningAction:
        return CleaningAction(
            action=action,
            column=column,
            description=description,
            confidence=confidence,
            automatic=automatic,
            estimated_affected_rows=estimated_affected_rows,
            recommendation=recommendation,
        )

    @staticmethod
    def build_result(
        dataframe: DataFrame,
        actions: list[CleaningAction]
    ) -> CleaningResult:
        return CleaningResult(
            dataframe=dataframe,
            actions=actions,
        )