from app.profiling.classifier.scorers.semantic.base_regex_detector import BaseRegexDetector


class PostalCodeDetector(BaseRegexDetector):

    semantic_type = "postal_code"

    confidence = 0.95

    threshold = 0.8

    patterns = [

        r"^\d{4}$",

        r"^\d{5}$",

        r"^[A-Z]\d[A-Z]\d[A-Z]\d$",

        r"^[A-Z]\d{4}[A-Z]{3}$"

    ]