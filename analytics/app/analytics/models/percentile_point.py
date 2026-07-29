from pydantic import BaseModel


class PercentilePoint(BaseModel):

    percentile: float

    value: float | None = None