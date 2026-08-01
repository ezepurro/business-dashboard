from pydantic import BaseModel, Field


class ExecutiveSummary(BaseModel):

    text: str = ""

    generated_from: list[str] = Field(default_factory=list)