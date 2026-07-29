from pydantic import BaseModel, ConfigDict, Field

from app.analytics.models.analysis_result import AnalysisResult
from app.analytics.models.business_metric import BusinessMetric
from app.analytics.models.chart_data import ChartData
from app.analytics.models.finding import Finding


class AnalyticsReport(BaseModel):

    model_config = ConfigDict(
        arbitrary_types_allowed=True
    )

    metrics: list[BusinessMetric] = Field(default_factory=list)

    charts: list[ChartData] = Field(default_factory=list)

    findings: list[Finding] = Field(default_factory=list)

    analyzer_results: dict[str, AnalysisResult] = Field(default_factory=dict)