from pydantic import BaseModel

from app.profiling.models.column_metadata import ColumnMetadata


class DatasetMetadata(BaseModel):

    rows: int

    columns: int

    data_dictionary: list[ColumnMetadata]