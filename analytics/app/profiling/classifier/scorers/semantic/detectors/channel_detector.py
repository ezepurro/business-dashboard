from app.profiling.classifier.scorers.semantic.base_keyword_detector import BaseKeywordDetector


class ChannelDetector(BaseKeywordDetector):

    semantic_type = "channel"

    confidence = 0.92

    keywords = {

        "online",
        "presencial",
        "web",
        "whatsapp",
        "instagram",
        "facebook",
        "telefono",
        "teléfono",
        "email",
        "sucursal",
        "tienda",

        "store",
        "phone"

    }