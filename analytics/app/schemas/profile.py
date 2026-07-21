from pydantic import BaseModel


class DatasetProfile(BaseModel):

    rows: int
    columns: int
    duplicate_rows: int

    dtypes: dict[str, str]
    missing_values: dict[str, int]

    sample: list[dict]

    detected_columns: dict[str, str]