from app.profiling.models.scorer_result import ScorerResult


class ScoreCombiner:

    def combine(
        self,
        results: list[ScorerResult]
    ) -> ScorerResult:

        valid = [

            result

            for result in results

            if result.semantic_type is not None

        ]

        if not valid:

            return ScorerResult(
                semantic_type=None,
                matched_term=None,
                confidence=0
            )

        grouped: dict[str, list[ScorerResult]] = {}

        for result in valid:

            grouped.setdefault(
                result.semantic_type,
                []
            ).append(result)

        best_type = None
        best_score = -1.0
        best_term = None

        for semantic_type, predictions in grouped.items():

            score = sum(
                prediction.confidence
                for prediction in predictions
            )

            if score > best_score:

                best_score = score
                best_type = semantic_type
                best_term = predictions[0].matched_term

        return ScorerResult(
            semantic_type=best_type,
            matched_term=best_term,
            confidence=min(best_score, 1.0)
        )