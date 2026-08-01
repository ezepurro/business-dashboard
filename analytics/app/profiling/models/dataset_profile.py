from pydantic import BaseModel, field_serializer

from app.profiling.models.classified_column import ClassifiedColumn
from app.profiling.models.dataset_metadata import DatasetMetadata
from app.quality.models.quality_report import QualityReport
from app.cleaning.models.cleaning_report import CleaningReport
from app.transformation.models.transformation_report import TransformationReport
from app.analytics.models.analytics_report import AnalyticsReport
from insights.models.insight_report import InsightReport
from app.utils.serialization import normalize_json_records


class DatasetProfile(BaseModel):

    rows: int

    columns: int

    duplicate_rows: int

    dtypes: dict[str, str]

    missing_values: dict[str, int]

    sample: list[dict]

    classified_columns: list[ClassifiedColumn]

    metadata: DatasetMetadata

    quality: QualityReport

    cleaning: CleaningReport

    transformation: TransformationReport | None = None

    analytics: AnalyticsReport | None = None

    insights: InsightReport | None = None

    @field_serializer("sample")
    def serialize_sample(self, sample: list[dict]) -> list[dict]:
        return normalize_json_records(sample)