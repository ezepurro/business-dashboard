from app.profiling.models.classification_context import ClassificationContext
from app.profiling.models.scorer_result import ScorerResult


class DTypeScorer:

    def score(
        self,
        context: ClassificationContext
    ) -> ScorerResult:

        dtype = context.dtype.lower()

        if "datetime" in dtype:

            return ScorerResult(
                semantic_type="date",
                matched_term="dtype",
                confidence=0.95
            )

        if dtype in ("int64", "float64", "int32", "float32"):

            return ScorerResult(
                semantic_type="numeric_measure",
                matched_term="dtype",
                confidence=0.30
            )

        return ScorerResult(
            semantic_type=None,
            matched_term=None,
            confidence=0
        )