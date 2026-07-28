from typing import Any

from pydantic import BaseModel


class TransformationAction(BaseModel):

    transformation: str

    column: str | None = None

    description: str

    confidence: float

    affected_rows: int | None = None

    previous_dtype: str | None = None

    new_dtype: str | None = None

    recommendation: str | None = None

    details: dict[str, Any] | None = None