from pandas import DataFrame

from app.quality.analyzers.completeness_analyzer import CompletenessAnalyzer
from app.quality.analyzers.uniqueness_analyzer import UniquenessAnalyzer
from app.quality.analyzers.validity_analyzer import ValidityAnalyzer
from app.quality.analyzers.consistency_analyzer import ConsistencyAnalyzer

from app.quality.models.quality_metric import QualityMetric
from app.quality.models.quality_report import QualityReport


class QualityEngine:

    def __init__(self):

        self.completeness = CompletenessAnalyzer()

        self.uniqueness = UniquenessAnalyzer()

        self.validity = ValidityAnalyzer()

        self.consistency = ConsistencyAnalyzer()

    def analyze(
        self,
        df: DataFrame
    ) -> QualityReport:

        completeness = self.completeness.analyze(df)

        uniqueness = self.uniqueness.analyze(df)

        validity = self.validity.analyze(df)

        consistency = self.consistency.analyze(df)

        overall = round(

            (
                completeness +
                uniqueness +
                validity +
                consistency
            ) / 4,

            2

        )

        return QualityReport(

            overall_score=overall,

            metrics=[

                QualityMetric(
                    name="Completeness",
                    score=completeness,
                    description="Percentage of non-missing values."
                ),

                QualityMetric(
                    name="Uniqueness",
                    score=uniqueness,
                    description="Percentage of unique rows."
                ),

                QualityMetric(
                    name="Validity",
                    score=validity,
                    description="Percentage of valid values."
                ),

                QualityMetric(
                    name="Consistency",
                    score=consistency,
                    description="Consistency of categorical values."
                )

            ]

        )