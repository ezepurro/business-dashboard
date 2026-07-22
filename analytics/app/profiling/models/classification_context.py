from typing import Any

from pydantic import BaseModel


class ClassificationContext(BaseModel):

    column_name: str

    dtype: str

    unique_values: int

    null_percentage: float

    sample_values: list[Any]