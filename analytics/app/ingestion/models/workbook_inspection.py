from pydantic import BaseModel

from app.ingestion.models.sheet_inspection import SheetInspection
from app.ingestion.models.header_detection import HeaderDetection
from app.ingestion.models.footer_detection import FooterDetection


class WorkbookInspection(BaseModel):

    sheet: SheetInspection

    header: HeaderDetection

    footer: FooterDetection

    rows: list[list]