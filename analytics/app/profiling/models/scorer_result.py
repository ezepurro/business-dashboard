from pydantic import BaseModel


class ScorerResult(BaseModel):

    semantic_type: str | None

    matched_term: str | None

    confidence: float