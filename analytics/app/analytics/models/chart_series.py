from pydantic import BaseModel, Field

from app.analytics.models.chart_point import ChartPoint


class ChartSeries(BaseModel):

    name: str

    points: list[ChartPoint] = Field(default_factory=list)