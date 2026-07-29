from pydantic import BaseModel


class TimeSeriesPoint(BaseModel):

    label: str

    value: float

    previous_value: float | None = None

    growth_rate: float | None = None