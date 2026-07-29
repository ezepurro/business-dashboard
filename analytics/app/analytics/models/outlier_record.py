from pydantic import BaseModel


class OutlierRecord(BaseModel):

    row_index: int

    column: str

    value: float | int | str | None

    lower_bound: float

    upper_bound: float

    distance: float | None = None