from pydantic import BaseModel


class SheetInspection(BaseModel):

    sheet_name: str

    total_score: float

    row_score: float

    column_score: float

    header_score: float

    penalty_score: float