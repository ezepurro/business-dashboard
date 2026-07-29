from pydantic import BaseModel, Field

from app.analytics.models.distribution_item import DistributionItem


class CategorySummary(BaseModel):

    column: str

    category_count: int

    dominant_category: str | None = None

    dominant_percentage: float | None = None

    distribution: list[DistributionItem] = Field(default_factory=list)

    entropy: float | None = None