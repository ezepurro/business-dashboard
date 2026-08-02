from pydantic import BaseModel, Field

from app.insights.models.executive_summary import ExecutiveSummary
from app.insights.models.insight import Insight
from app.insights.models.insight_group import InsightGroup


class InsightReport(BaseModel):

    summary: ExecutiveSummary

    insights: list[Insight] = Field(
        default_factory=list
    )

    groups: list[InsightGroup] = Field(
        default_factory=list
    )