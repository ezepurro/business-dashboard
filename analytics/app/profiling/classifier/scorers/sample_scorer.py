import re

import pandas as pd

from app.profiling.models.classification_context import ClassificationContext
from app.profiling.models.scorer_result import ScorerResult


BOOLEAN_VALUES = {
    "si",
    "sí",
    "no",
    "true",
    "false",
    "0",
    "1"
}

EMAIL_REGEX = re.compile(
    r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
)

PHONE_REGEX = re.compile(
    r"^\+?[0-9\s\-()]{7,}$"
)


class SampleScorer:

    def score(
        self,
        context: ClassificationContext
    ) -> ScorerResult:

        samples = [
            str(value).strip()
            for value in context.sample_values
            if str(value).strip()
        ]

        if not samples:
            return ScorerResult(
                semantic_type=None,
                matched_term=None,
                confidence=0
            )

        boolean = self._boolean(samples)
        if boolean:
            return boolean

        email = self._email(samples)
        if email:
            return email

        phone = self._phone(samples)
        if phone:
            return phone

        date = self._date(samples)
        if date:
            return date

        numeric = self._numeric(samples)
        if numeric:
            return numeric

        return ScorerResult(
            semantic_type=None,
            matched_term=None,
            confidence=0
        )

    def _boolean(
        self,
        samples: list[str]
    ) -> ScorerResult | None:

        normalized = {
            sample.lower()
            for sample in samples
        }

        if normalized.issubset(BOOLEAN_VALUES):

            return ScorerResult(
                semantic_type="boolean",
                matched_term="sample",
                confidence=0.95
            )

        return None

    def _email(
        self,
        samples: list[str]
    ) -> ScorerResult | None:

        hits = sum(
            EMAIL_REGEX.match(sample) is not None
            for sample in samples
        )

        ratio = hits / len(samples)

        if ratio >= 0.8:

            return ScorerResult(
                semantic_type="email",
                matched_term="sample",
                confidence=0.95
            )

        return None

    def _phone(
        self,
        samples: list[str]
    ) -> ScorerResult | None:

        hits = sum(
            PHONE_REGEX.match(sample) is not None
            for sample in samples
        )

        ratio = hits / len(samples)

        if ratio >= 0.8:

            return ScorerResult(
                semantic_type="phone",
                matched_term="sample",
                confidence=0.90
            )

        return None

    def _date(
        self,
        samples: list[str]
    ) -> ScorerResult | None:

        parsed = 0

        for sample in samples:

            try:
                pd.to_datetime(sample)
                parsed += 1
            except Exception:
                pass

        ratio = parsed / len(samples)

        if ratio >= 0.8:

            return ScorerResult(
                semantic_type="date",
                matched_term="sample",
                confidence=0.90
            )

        return None

    def _numeric(
        self,
        samples: list[str]
    ) -> ScorerResult | None:

        parsed = 0

        for sample in samples:

            try:
                float(sample)
                parsed += 1
            except Exception:
                pass

        ratio = parsed / len(samples)

        if ratio >= 0.8:

            return ScorerResult(
                semantic_type="numeric_measure",
                matched_term="sample",
                confidence=0.75
            )

        return None