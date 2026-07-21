from pydantic import BaseModel


class ClassifiedColumn(BaseModel):
    original_name: str
    semantic_type: str | None
    confidence: float
    matched_term: str | None