from app.profiling.classifier.scorers.semantic.base_keyword_detector import BaseKeywordDetector


class SizeDetector(BaseKeywordDetector):

    semantic_type = "size"

    confidence = 0.95

    keywords = {

        "xs",

        "s",

        "m",

        "l",

        "xl",

        "xxl",

        "xxxl"

    }