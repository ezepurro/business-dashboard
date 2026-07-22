from app.profiling.models.classification_context import ClassificationContext
from app.profiling.models.scorer_result import ScorerResult


class CardinalityScorer:

    def score(
        self,
        context: ClassificationContext
    ) -> ScorerResult:

        unique = context.unique_values

        if unique == 2:

            return ScorerResult(
                semantic_type="boolean",
                matched_term="cardinality",
                confidence=0.35
            )

        if unique <= 10:

            return ScorerResult(
                semantic_type="categorical",
                matched_term="cardinality",
                confidence=0.25
            )

        return ScorerResult(
            semantic_type=None,
            matched_term=None,
            confidence=0
        )