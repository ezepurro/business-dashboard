from typing import Any

from app.ingestion.models.header_detection import HeaderDetection



class HeaderDetector:

    def detect(
        self,
        rows: list[list[Any]]
    ) -> int:

        best_row = 0
        best_score = -1

        for index, row in enumerate(rows):

            score = self._score_row(row)

            if score > best_score:
                best_score = score
                best_row = index

        MAX_POSSIBLE = 100  
        confidence = min(best_score / MAX_POSSIBLE, 1.0)

        return HeaderDetection(
            header_row=best_row,
            confidence=round(confidence, 2)
        )

    def _score_row(
        self,
        row: list[Any]
    ) -> int:

        score = 0

        non_empty = [cell for cell in row if cell is not None]

        if not non_empty:
            return 0

        # Muchas columnas completas
        score += len(non_empty) * 10

        text_cells = sum(
            isinstance(cell, str)
            for cell in non_empty
        )

        score += text_cells * 5

        numeric_cells = sum(
            isinstance(cell, (int, float))
            for cell in non_empty
        )

        score -= numeric_cells * 3

        unique_values = len(set(map(str, non_empty)))

        score += unique_values

        return score