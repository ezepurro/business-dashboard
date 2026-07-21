from pandas import DataFrame

from app.profiling.classifier.column_normalizer import ColumnNormalizer
from app.profiling.classifier.confidence_scorer import ConfidenceScorer
from app.profiling.classifier.dictionaries.column_aliases import COLUMN_ALIASES
from app.profiling.models.classified_column import ClassifiedColumn


class ColumnClassifier:

    def classify(
        self,
        df: DataFrame
    ) -> list[ClassifiedColumn]:

        classified_columns: list[ClassifiedColumn] = []

        for column in df.columns:

            normalized = ColumnNormalizer.normalize(column)

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

            classified_columns.append(

                ClassifiedColumn(
                    original_name=column,
                    semantic_type=best_type,
                    confidence=best_score,
                    matched_term=best_alias
                )

            )

        return classified_columns