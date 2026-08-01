from pydantic import BaseModel, Field

from insights.models.insight_category import InsightCategory
from insights.models.insight_priority import InsightPriority


class Insight(BaseModel):

    title: str

    description: str

    category: InsightCategory

    priority: InsightPriority

    confidence: float = 1.0

    related_metrics: list[str] = Field(default_factory=list)

    related_columns: list[str] = Field(default_factory=list)

    recommendations: list[str] = Field(default_factory=list)