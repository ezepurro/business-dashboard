from pydantic import BaseModel


class QualityMetric(BaseModel):

    name: str

    score: float

    description: str