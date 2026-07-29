from pydantic import BaseModel, Field

from app.analytics.models.distribution_item import DistributionItem
from app.analytics.models.percentile_point import PercentilePoint


class DistributionSummary(BaseModel):

    column: str

    count: int

    mean: float | None = None

    median: float | None = None

    mode: float | None = None

    std_dev: float | None = None

    minimum: float | None = None

    maximum: float | None = None

    q1: float | None = None

    q3: float | None = None

    iqr: float | None = None

    skewness: float | None = None

    kurtosis: float | None = None

    percentiles: list[PercentilePoint] = Field(default_factory=list)

    histogram: list[DistributionItem] = Field(default_factory=list)