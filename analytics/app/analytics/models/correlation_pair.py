from pydantic import BaseModel


class CorrelationPair(BaseModel):

    column_x: str

    column_y: str

    coefficient: float