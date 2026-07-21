from typing import Any

from pydantic import BaseModel

from app.ingestion.models.sheet_inspection import SheetInspection
from app.ingestion.models.header_detection import HeaderDetection


class WorkbookInspection(BaseModel):

    sheet: SheetInspection

    header: HeaderDetection

    rows: list[list[Any]]