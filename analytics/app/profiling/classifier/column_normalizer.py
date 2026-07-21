import re
import unicodedata


class ColumnNormalizer:

    @staticmethod
    def normalize(column_name: str) -> str:
        """
        Normaliza el nombre de una columna para facilitar su comparación.

        Ejemplos:
            "Fecha Venta"      -> "fecha venta"
            "Total Facturado$" -> "total facturado"
            "Artículo Nº"      -> "articulo n"
        """

        column_name = column_name.lower()

        column_name = unicodedata.normalize(
            "NFKD",
            column_name
        )

        column_name = column_name.encode(
            "ascii",
            "ignore"
        ).decode("utf-8")

        column_name = re.sub(
            r"[^a-z0-9 ]",
            " ",
            column_name
        )

        column_name = re.sub(
            r"\s+",
            " ",
            column_name
        )

        return column_name.strip()