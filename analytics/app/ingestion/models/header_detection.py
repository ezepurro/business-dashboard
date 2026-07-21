from pydantic import BaseModel


class HeaderDetection(BaseModel):

    header_row: int

    confidence: float