from app.profiling.classifier.scorers.semantic.base_keyword_detector import BaseKeywordDetector


class CountryDetector(BaseKeywordDetector):

    semantic_type = "country"

    confidence = 0.94

    keywords = {

        "argentina",
        "brasil",
        "chile",
        "uruguay",
        "paraguay",
        "bolivia",
        "peru",
        "méxico",
        "mexico",
        "españa",
        "espana",
        "estados unidos",

        "brazil",
        "usa",
        "canada",
        "france",
        "italy",
        "germany",
        "spain"

    }