from pydantic import BaseModel, Field

from insights.models.executive_summary import ExecutiveSummary
from insights.models.insight import Insight
from insights.models.insight_group import InsightGroup


class InsightReport(BaseModel):

    summary: ExecutiveSummary = Field(
        default_factory=ExecutiveSummary
    )

    insights: list[Insight] = Field(
        default_factory=list
    )

    groups: list[InsightGroup] = Field(
        default_factory=list
    )