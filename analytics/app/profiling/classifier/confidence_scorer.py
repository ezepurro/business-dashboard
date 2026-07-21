from difflib import SequenceMatcher


class ConfidenceScorer:

    @staticmethod
    def score(
        value: str,
        alias: str
    ) -> float:

        return round(
            SequenceMatcher(
                None,
                value,
                alias
            ).ratio(),
            2
        )