from app.profiling.classifier.scorers.semantic.base_keyword_detector import BaseKeywordDetector


class MoneyDetector(BaseKeywordDetector):

    semantic_type = "money"

    confidence = 0.94

    keywords = {

        "$",

        "usd",

        "ars",

        "eur",

        "dolar",

        "dólar",

        "peso",

        "pesos",

        "precio",

        "importe",

        "monto",

        "total"

    }