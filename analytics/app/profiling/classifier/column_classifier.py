from app.profiling.classifier.scorers.name_scorer import NameScorer
from app.profiling.classifier.scorers.sample_scorer import SampleScorer
from app.profiling.classifier.scorers.dtype_scorer import DTypeScorer
from app.profiling.classifier.scorers.cardinality_scorer import CardinalityScorer
from app.profiling.classifier.scorers.score_combiner import ScoreCombiner
from app.profiling.classifier.scorers.semantic.semantic_sample_scorer import SemanticSampleScorer

from app.profiling.models.classification_context import ClassificationContext
from app.profiling.models.classified_column import ClassifiedColumn


class ColumnClassifier:

    def __init__(self):

        self.name = NameScorer()
        self.sample = SampleScorer()
        self.dtype = DTypeScorer()
        self.cardinality = CardinalityScorer()
        self.semantic = SemanticSampleScorer()

        self.combiner = ScoreCombiner()

    def classify(
        self,
        context: ClassificationContext
    ) -> ClassifiedColumn:

        result = self.combiner.combine(

            [

                self.name.score(context),

                self.sample.score(context),

                self.semantic.score(context),

                self.dtype.score(context),

                self.cardinality.score(context)

            ]

        )

        return ClassifiedColumn(

            original_name=context.column_name,

            semantic_type=result.semantic_type,

            confidence=result.confidence,

            matched_term=result.matched_term

        )