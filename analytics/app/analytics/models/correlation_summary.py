from pydantic import BaseModel, Field

from app.analytics.models.correlation_pair import CorrelationPair


class CorrelationSummary(BaseModel):

    columns: list[str]

    matrix: list[list[float]]

    strong_correlations: list[CorrelationPair] = Field(default_factory=list)

    strong_negative_correlations: list[CorrelationPair] = Field(default_factory=list)