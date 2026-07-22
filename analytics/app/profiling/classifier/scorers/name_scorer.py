from app.profiling.classifier.column_normalizer import ColumnNormalizer
from app.profiling.classifier.confidence_scorer import ConfidenceScorer
from app.profiling.classifier.dictionaries.column_aliases import COLUMN_ALIASES

from app.profiling.models.scorer_result import ScorerResult


class NameScorer:

    def score(
        self,
        column_name: str
    ) -> ScorerResult:

        normalized = ColumnNormalizer.normalize(column_name)

        best_type = None
        best_alias = None
        best_score = 0.0

        for semantic_type, aliases in COLUMN_ALIASES.items():

            for alias in aliases:

                score = ConfidenceScorer.score(
                    normalized,
                    alias
                )

                if score > best_score:

                    best_score = score
                    best_type = semantic_type
                    best_alias = alias

        return ScorerResult(

            semantic_type=best_type,

            matched_term=best_alias,

            confidence=best_score

        )