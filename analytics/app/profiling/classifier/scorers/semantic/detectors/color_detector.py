from app.profiling.classifier.scorers.semantic.base_keyword_detector import BaseKeywordDetector


class ColorDetector(BaseKeywordDetector):

    semantic_type = "color"

    confidence = 0.94

    keywords = {

        "rojo",
        "azul",
        "verde",
        "amarillo",
        "negro",
        "blanco",
        "gris",
        "rosa",
        "violeta",
        "marron",
        "marrón",

        "red",
        "blue",
        "green",
        "black",
        "white"

    }