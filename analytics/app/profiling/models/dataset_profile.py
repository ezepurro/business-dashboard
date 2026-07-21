from pydantic import BaseModel

from app.profiling.models.classified_column import ClassifiedColumn


class DatasetProfile(BaseModel):

    rows: int

    columns: int

    duplicate_rows: int

    dtypes: dict[str, str]

    missing_values: dict[str, int]

    sample: list[dict]

    classified_columns: list[ClassifiedColumn]