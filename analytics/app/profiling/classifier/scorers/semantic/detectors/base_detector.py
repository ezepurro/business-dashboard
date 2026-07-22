from abc import ABC, abstractmethod

from app.profiling.models.classification_context import ClassificationContext
from app.profiling.models.scorer_result import ScorerResult


class BaseDetector(ABC):

    @abstractmethod
    def detect(
        self,
        context: ClassificationContext
    ) -> ScorerResult:
        ...