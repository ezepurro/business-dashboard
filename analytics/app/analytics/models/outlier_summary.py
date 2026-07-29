from pydantic import BaseModel, Field

from app.analytics.models.outlier_record import OutlierRecord


class OutlierSummary(BaseModel):

    column: str

    lower_bound: float

    upper_bound: float

    outlier_count: int

    outliers: list[OutlierRecord] = Field(default_factory=list)