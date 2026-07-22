from app.profiling.classifier.scorers.semantic.base_keyword_detector import BaseKeywordDetector


class CurrencyDetector(BaseKeywordDetector):

    semantic_type = "currency"

    confidence = 0.93

    keywords = {

        "ars",

        "usd",

        "eur",

        "gbp",

        "brl",

        "clp"

    }