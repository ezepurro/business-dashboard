from app.profiling.classifier.scorers.semantic.base_regex_detector import BaseRegexDetector


class ProductCodeDetector(BaseRegexDetector):

    semantic_type = "product_code"

    confidence = 0.95

    threshold = 0.7

    patterns = [

        r"^[A-Z]{2,5}-\d{3,}$",

        r"^[A-Z]\d{4,}$",

        r"^[A-Z]{2,}\d+$",

        r"^[A-Z0-9]{6,20}$",

        r"^[A-Z]{1,3}-[A-Z0-9]+$"

    ]