from typing import Any

from pydantic import BaseModel, Field

from app.analytics.models.chart_series import ChartSeries


class ChartData(BaseModel):

    chart_type: str

    title: str | None = None

    labels: list[Any] = Field(default_factory=list)

    series: list[ChartSeries] = Field(default_factory=list)