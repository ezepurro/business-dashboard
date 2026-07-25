from pydantic import BaseModel


class FooterDetection(BaseModel):

    footer_row: int

    confidence: float