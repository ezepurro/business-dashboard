from app.profiling.classifier.scorers.semantic.base_keyword_detector import BaseKeywordDetector


class PaymentMethodDetector(BaseKeywordDetector):

    semantic_type = "payment_method"

    confidence = 0.93

    keywords = {

        "efectivo",
        "tarjeta",
        "debito",
        "débito",
        "credito",
        "crédito",
        "mercado pago",
        "transferencia",
        "transferencia bancaria",
        "paypal",

        "cash",
        "credit card",
        "debit card",
        "bank transfer"

    }