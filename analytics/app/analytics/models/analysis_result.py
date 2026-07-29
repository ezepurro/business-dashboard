from pydantic import BaseModel, Field

from app.analytics.models.business_metric import BusinessMetric
from app.analytics.models.chart_data import ChartData
from app.analytics.models.finding import Finding


class AnalysisResult(BaseModel):

    metrics: list[BusinessMetric] = Field(default_factory=list)

    charts: list[ChartData] = Field(default_factory=list)

    findings: list[Finding] = Field(default_factory=list)