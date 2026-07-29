from pydantic import BaseModel, Field

from app.analytics.models.distribution_item import DistributionItem


class EntitySummary(BaseModel):

    column: str

    entity_type: str

    unique_count: int

    total_records: int

    total_value: float | None = None

    average_value: float | None = None

    frequency: float | None = None

    recurrence_rate: float | None = None

    top_items: list[DistributionItem] = Field(default_factory=list)

    bottom_items: list[DistributionItem] = Field(default_factory=list)

    ranking: list[DistributionItem] = Field(default_factory=list)