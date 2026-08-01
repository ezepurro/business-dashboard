from pydantic import BaseModel, Field

from insights.models.insight import Insight


class InsightGroup(BaseModel):

    category: str

    insights: list[Insight] = Field(default_factory=list)