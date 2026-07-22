from typing import Any

from pydantic import BaseModel


class ColumnMetadata(BaseModel):

    name: str

    semantic_type: str

    confidence: float

    dtype: str

    nullable: bool

    null_percentage: float

    unique_values: int

    sample_values: list[Any]