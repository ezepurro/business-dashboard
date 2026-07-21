from email import header
from io import BytesIO

from openpyxl import load_workbook

from app.ingestion.inspectors.header_detector import HeaderDetector
from app.ingestion.models.workbook_inspection import WorkbookInspection
from app.ingestion.inspectors.sheet_detector import SheetDetector


class WorkbookInspector:

    def inspect(
        self,
        file_bytes: bytes,
        max_rows: int = 10
    ) -> list[list]:

        workbook = load_workbook(
            BytesIO(file_bytes),
            read_only=True,
            data_only=True
        )

        sheet = SheetDetector().detect(workbook)

        worksheet = workbook[sheet.sheet_name]

        rows = []

        for row in worksheet.iter_rows(
            min_row=1,
            max_row=max_rows,
            values_only=True
        ):

            rows.append(list(row))

        header = HeaderDetector().detect(rows)

        sheet_inspection = SheetDetector().detect(workbook)

        workbook.close()

        return WorkbookInspection(
            sheet=sheet_inspection,
            header=header,
            rows=rows
        )