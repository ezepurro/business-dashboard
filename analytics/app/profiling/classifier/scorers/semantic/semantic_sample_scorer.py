from app.profiling.classifier.scorers.semantic.detectors.product_code_detector import ProductCodeDetector
from app.profiling.classifier.scorers.semantic.detectors.postal_code_detector import PostalCodeDetector
from app.profiling.classifier.scorers.semantic.detectors.document_detector import DocumentDetector
from app.profiling.classifier.scorers.semantic.detectors.identifier_detector import IdentifierDetector
from app.profiling.classifier.scorers.semantic.detectors.money_detector import MoneyDetector
from app.profiling.classifier.scorers.semantic.detectors.size_detector import SizeDetector
from app.profiling.classifier.scorers.semantic.detectors.location_detector import LocationDetector
from app.profiling.classifier.scorers.semantic.detectors.location_detector import LocationDetector
from app.profiling.classifier.scorers.semantic.detectors.status_detector import StatusDetector
from app.profiling.classifier.scorers.semantic.detectors.payment_method_detector import PaymentMethodDetector
from app.profiling.classifier.scorers.semantic.detectors.gender_detector import GenderDetector
from app.profiling.classifier.scorers.semantic.detectors.country_detector import CountryDetector
from app.profiling.classifier.scorers.semantic.detectors.channel_detector import ChannelDetector
from app.profiling.classifier.scorers.semantic.detectors.currency_detector import CurrencyDetector
from app.profiling.classifier.scorers.semantic.detectors.color_detector import ColorDetector

from app.profiling.models.classification_context import ClassificationContext
from app.profiling.models.scorer_result import ScorerResult


class SemanticSampleScorer:

    def __init__(self):

        self.detectors = [

            LocationDetector(),

            StatusDetector(),

            PaymentMethodDetector(),

            GenderDetector(),

            CountryDetector(),

            ChannelDetector(),

            LocationDetector(),

            StatusDetector(),

            PaymentMethodDetector(),

            GenderDetector(),

            CountryDetector(),

            ChannelDetector(),

            MoneyDetector(),

            CurrencyDetector(),

            ColorDetector(),

            SizeDetector(),

            IdentifierDetector(),

            ProductCodeDetector(),

            PostalCodeDetector(),
            
            DocumentDetector(),

        ]

    def score(
        self,
        context: ClassificationContext
    ) -> ScorerResult:

        best = ScorerResult(

            semantic_type=None,

            matched_term=None,

            confidence=0

        )

        for detector in self.detectors:

            result = detector.detect(context)

            if result.confidence > best.confidence:

                best = result

        return best