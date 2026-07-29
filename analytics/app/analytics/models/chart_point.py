from typing import Any

from pydantic import BaseModel


class ChartPoint(BaseModel):

    label: str

    value: Any

    share: float | None = None