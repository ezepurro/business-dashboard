from abc import ABC

from app.profiling.classifier.scorers.semantic.detectors.base_detector import BaseDetector

from app.profiling.models.classification_context import ClassificationContext
from app.profiling.models.scorer_result import ScorerResult


class BaseKeywordDetector(BaseDetector, ABC):

    semantic_type: str
    confidence: float
    keywords: set[str]

    def detect(
        self,
        context: ClassificationContext
    ) -> ScorerResult:

        samples = {

            str(value).strip().lower()

            for value in context.sample_values

            if value is not None

        }

        if not samples:

            return ScorerResult(
                semantic_type=None,
                matched_term=None,
                confidence=0
            )

        matches = len(samples & self.keywords)

        ratio = matches / len(samples)

        if ratio >= 0.6:

            return ScorerResult(

                semantic_type=self.semantic_type,

                matched_term="sample",

                confidence=self.confidence

            )

        return ScorerResult(
            semantic_type=None,
            matched_term=None,
            confidence=0
        )