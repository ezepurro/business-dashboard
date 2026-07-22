from app.profiling.classifier.scorers.semantic.base_keyword_detector import BaseKeywordDetector


class StatusDetector(BaseKeywordDetector):

    semantic_type = "status"

    confidence = 0.92

    keywords = {

        "activo",
        "inactivo",
        "pendiente",
        "pagado",
        "cancelado",
        "anulado",
        "rechazado",
        "aprobado",
        "procesando",
        "finalizado",

        "active",
        "inactive",
        "pending",
        "paid",
        "canceled",
        "approved"

    }