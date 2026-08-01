from typing import Any

from pydantic import BaseModel, field_serializer

from app.utils.serialization import normalize_json_value


class ColumnMetadata(BaseModel):

    name: str

    semantic_type: str

    confidence: float

    dtype: str

    nullable: bool

    null_percentage: float

    unique_values: int

    sample_values: list[Any]

    @field_serializer("sample_values")
    def serialize_sample_values(self, sample_values: list[Any]) -> list[Any]:
        return [normalize_json_value(value) for value in sample_values]