from pydantic import BaseModel, Field

from app.analytics.models.time_series_point import TimeSeriesPoint


class TimeSeriesData(BaseModel):

    frequency: str

    points: list[TimeSeriesPoint] = Field(default_factory=list)