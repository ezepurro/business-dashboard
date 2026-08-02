from pydantic import BaseModel, Field

from app.insights.models.insight import Insight
from app.insights.models.insight_priority import InsightPriority


class InsightGroup(BaseModel):

    category: str

    priority: InsightPriority

    insight_count: int

    critical_count: int

    high_count: int

    insights: list[Insight] = Field(
        default_factory=list
    )