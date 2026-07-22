from app.profiling.classifier.scorers.semantic.base_keyword_detector import BaseKeywordDetector


class LocationDetector(BaseKeywordDetector):

    semantic_type = "location"

    confidence = 0.90

    keywords = {

        "norte",
        "sur",
        "este",
        "oeste",
        "centro",

        "north",
        "south",
        "east",
        "west"

    }