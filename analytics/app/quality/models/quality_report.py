from pydantic import BaseModel

from app.quality.models.quality_metric import QualityMetric


class QualityReport(BaseModel):

    overall_score: float

    metrics: list[QualityMetric]