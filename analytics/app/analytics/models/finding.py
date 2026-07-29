from pydantic import BaseModel, Field


class Finding(BaseModel):

    title: str

    description: str

    severity: str = "info"

    confidence: float | None = None

    related_columns: list[str] = Field(default_factory=list)

    metric_names: list[str] = Field(default_factory=list)

    evidence: list[str] = Field(default_factory=list)