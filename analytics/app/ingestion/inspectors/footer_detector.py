from app.ingestion.models.footer_detection import FooterDetection


FOOTER_KEYWORDS = {

    "total",
    "total general",
    "subtotal",
    "grand total",
    "sum",
    "totales"

}


class FooterDetector:

    def detect(
        self,
        rows: list[list]
    ) -> FooterDetection:

        best_row = len(rows)

        best_score = 0.0

        for index in range(len(rows) - 1, -1, -1):

            row = rows[index]

            values = [

                str(value).strip().lower()

                for value in row

                if value not in (None, "")

            ]

            if not values:
                continue

            score = 0.0

            # keyword
            if any(value in FOOTER_KEYWORDS for value in values):

                score += 0.6

            # muchas celdas vacías
            empty_ratio = sum(
                value in (None, "")
                for value in row
            ) / len(row)

            if empty_ratio >= 0.6:

                score += 0.2

            # está cerca del final
            if index >= len(rows) * 0.8:

                score += 0.2

            if score > best_score:

                best_score = score

                best_row = index

        return FooterDetection(

            footer_row=best_row,

            confidence=best_score

        )