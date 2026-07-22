import re
from abc import ABC

from app.profiling.classifier.scorers.semantic.detectors.base_detector import BaseDetector

from app.profiling.models.classification_context import ClassificationContext
from app.profiling.models.scorer_result import ScorerResult


class BaseRegexDetector(BaseDetector, ABC):

    semantic_type: str

    confidence: float

    threshold: float = 0.8

    patterns: list[str]

    def detect(
        self,
        context: ClassificationContext
    ) -> ScorerResult:

        samples = [

            str(value).strip().upper()

            for value in context.sample_values

            if value is not None

        ]

        if not samples:

            return ScorerResult(
                semantic_type=None,
                matched_term=None,
                confidence=0
            )

        matches = 0

        for sample in samples:

            if any(
                re.fullmatch(pattern, sample)
                for pattern in self.patterns
            ):
                matches += 1

        ratio = matches / len(samples)

        if ratio >= self.threshold:

            return ScorerResult(

                semantic_type=self.semantic_type,

                matched_term="regex",

                confidence=self.confidence

            )

        return ScorerResult(
            semantic_type=None,
            matched_term=None,
            confidence=0
        )