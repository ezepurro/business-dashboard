from pydantic import BaseModel


class CleaningAction(BaseModel):

    action: str

    column: str | None = None

    description: str

    confidence: float

    automatic: bool = True

    estimated_affected_rows: int | None = None

    recommendation: str | None = None