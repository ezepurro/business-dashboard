from pydantic import BaseModel


class DistributionItem(BaseModel):

    label: str

    count: float

    share: float

    rank: int | None = None