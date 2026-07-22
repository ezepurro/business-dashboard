from app.profiling.classifier.scorers.semantic.base_regex_detector import BaseRegexDetector


class DocumentDetector(BaseRegexDetector):

    semantic_type = "document"

    confidence = 0.96

    threshold = 0.8

    patterns = [

        r"^\d{7,8}$",

        r"^\d{2}-\d{8}-\d$",

        r"^\d{11}$",

        r"^\d{9}$",

        r"^[A-Z]{1,2}\d{6,9}$"

    ]