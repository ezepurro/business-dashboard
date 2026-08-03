from pydantic import BaseModel

from app.schemas.exports import (
    AnalyticsExport,
    CleaningExport,
    TransformationExport,
)

from app.profiling.models.dataset_metadata import DatasetMetadata
from app.quality.models.quality_report import QualityReport
from app.insights.models.insight_report import InsightReport


class ProcessDatasetRequest(BaseModel):
    dataset_id: str
    bucket: str
    object_key: str


class ProcessProfileResponse(BaseModel):

    metadata: DatasetMetadata

    quality: QualityReport

    sample: list[dict]

    missing_values: dict[str, int]

    cleaning: CleaningExport

    transformation: TransformationExport

    analytics: AnalyticsExport

    insights: InsightReport


class ProcessDatasetResponse(BaseModel):

    profile: ProcessProfileResponse

    engineVersion: str

    pythonVersion: str