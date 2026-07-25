from io import BytesIO
from pathlib import Path

import pandas as pd

from app.ingestion.minio_client import MinIOClient
from app.ingestion.inspectors.workbook_inspector import WorkbookInspector
from app.ingestion.cleaning.dataframe_cleaner import DataFrameCleaner


class DatasetLoader:

    def __init__(self):
        self.minio = MinIOClient()

    def load_dataframe(
        self,
        bucket: str,
        object_key: str
    ) -> pd.DataFrame:

        response = self.minio.get_object(
            bucket,
            object_key
        )

        try:

            file_bytes = response.read()

        finally:

            response.close()
            response.release_conn()

        extension = Path(object_key).suffix.lower()

        if extension == ".csv":

            df = pd.read_csv(
                BytesIO(file_bytes)
            )

            return DataFrameCleaner.clean(df)

        if extension in [".xlsx", ".xls"]:

            inspection = WorkbookInspector().inspect(
                file_bytes
            )

            print(
                f"""
                Workbook inspection
                -------------------
                Sheet: {inspection.sheet.sheet_name}
                Sheet score: {inspection.sheet.total_score:.2f}

                Header row: {inspection.header.header_row + 1}
                Header confidence: {inspection.header.confidence:.2f}

                Footer row: {inspection.footer.footer_row + 1}
                Footer confidence: {inspection.footer.confidence:.2f}
                """
            )

            df = pd.read_excel(
                BytesIO(file_bytes),
                sheet_name=inspection.sheet.sheet_name,
                header=inspection.header.header_row
            )

            # Eliminar el footer detectado
            footer_index = (
                inspection.footer.footer_row
                - inspection.header.header_row
                - 1
            )

            if 0 <= footer_index < len(df):

                df = df.iloc[:footer_index]

            df = DataFrameCleaner.clean(df)

            return df

        raise ValueError(
            f"Unsupported file format: {extension}"
        )