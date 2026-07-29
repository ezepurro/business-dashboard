from pydantic import BaseModel, Field

from app.analytics.models.percentile_point import PercentilePoint


class SalesSummary(BaseModel):

    column: str

    total_sales: float

    operation_count: int

    average_ticket: float | None = None

    median: float | None = None

    mean: float | None = None

    std_dev: float | None = None

    minimum: float | None = None

    maximum: float | None = None

    percentiles: list[PercentilePoint] = Field(default_factory=list)