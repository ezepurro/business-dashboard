from app.profiling.classifier.scorers.semantic.base_keyword_detector import BaseKeywordDetector


class GenderDetector(BaseKeywordDetector):

    semantic_type = "gender"

    confidence = 0.95

    keywords = {

        "masculino",
        "femenino",
        "hombre",
        "mujer",
        "otro",

        "male",
        "female",
        "other",

        "m",
        "f"

    }