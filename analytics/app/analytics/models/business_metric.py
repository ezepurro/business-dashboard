from typing import Any

from pydantic import BaseModel, Field


class BusinessMetric(BaseModel):

    name: str

    value: Any

    unit: str | None = None

    description: str | None = None

    column: str | None = None

    semantic_type: str | None = None

    confidence: float | None = None

    aggregation: str | None = None

    period: str | None = None

    tags: list[str] = Field(default_factory=list)