from pydantic import BaseModel, Field


class ExecutiveSummary(BaseModel):

    title: str

    description: str

    dataset_score: float

    quality_score: float

    total_rows: int

    total_columns: int

    total_insights: int

    critical_insights: int

    high_priority_insights: int

    top_strengths: list[str] = Field(default_factory=list)

    top_risks: list[str] = Field(default_factory=list)

    recommendations: list[str] = Field(default_factory=list)