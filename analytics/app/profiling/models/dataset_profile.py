from pydantic import BaseModel

from app.profiling.models.classified_column import ClassifiedColumn
from app.profiling.models.dataset_metadata import DatasetMetadata


class DatasetProfile(BaseModel):

    rows: int

    columns: int

    duplicate_rows: int

    dtypes: dict[str, str]

    missing_values: dict[str, int]

    sample: list[dict]

    classified_columns: list[ClassifiedColumn]

    metadata: DatasetMetadata