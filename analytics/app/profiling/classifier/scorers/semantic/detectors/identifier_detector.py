from app.profiling.classifier.scorers.semantic.detectors.base_detector import BaseDetector

from app.profiling.models.classification_context import ClassificationContext
from app.profiling.models.scorer_result import ScorerResult


class IdentifierDetector(BaseDetector):

    def detect(
        self,
        context: ClassificationContext
    ) -> ScorerResult:

        if context.total_rows == 0:

            return ScorerResult(
                semantic_type=None,
                matched_term=None,
                confidence=0
            )

        unique_ratio = context.unique_values / context.total_rows

        is_numeric = context.dtype.startswith(("int", "float"))

        if (
            is_numeric
            and unique_ratio >= 0.98
            and context.null_percentage == 0
        ):

            return ScorerResult(

                semantic_type="identifier",

                matched_term="unique_values",

                confidence=0.95

            )

        return ScorerResult(
            semantic_type=None,
            matched_term=None,
            confidence=0
        )