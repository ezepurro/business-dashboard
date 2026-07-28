from datetime import datetime

from pandas import DataFrame
from pandas import NaT
import pandas as pd

from app.profiling.models.dataset_metadata import DatasetMetadata
from app.transformation.models.base_transformer import BaseTransformer
from app.transformation.models.transformation_result import TransformationResult


DATE_SEMANTIC_TYPES = {
    "date",
    "datetime",
}

SUPPORTED_DATE_FORMATS = [
    "%d/%m/%Y",
    "%Y-%m-%d",
    "%d-%m-%y",
    "%Y/%m/%d",
    "%d-%m-%Y",
    "%d/%m/%y",
]


def _parse_date(value: str):
    stripped = value.strip()

    for date_format in SUPPORTED_DATE_FORMATS:
        try:
            return datetime.strptime(stripped, date_format)
        except ValueError:
            continue

    fallback = pd.to_datetime(stripped, errors="coerce", dayfirst=True)

    if pd.isna(fallback):
        return NaT

    return fallback


class DateTransformer(BaseTransformer):

    def transform(
        self,
        df: DataFrame,
        metadata: DatasetMetadata
    ) -> TransformationResult:

        df = df.copy()
        actions = []
        metadata_map = self.metadata_by_column(metadata)

        for column in df.columns:
            column_metadata = metadata_map.get(column)

            if column_metadata is None:
                continue

            semantic_hint = column_metadata.semantic_type in DATE_SEMANTIC_TYPES

            if not semantic_hint:
                continue

            previous_dtype = str(df[column].dtype)
            source_series = df[column].copy()

            parsed = df[column].map(
                lambda value: _parse_date(str(value)) if value is not None and not (isinstance(value, float) and value != value) else NaT
            )

            non_null = int(df[column].notna().sum())
            parsed_count = int(parsed.notna().sum())

            if non_null == 0 or parsed_count == 0:
                continue

            success_ratio = parsed_count / non_null

            if success_ratio < 0.7:
                continue

            df[column] = pd.to_datetime(parsed, errors="coerce")

            failed_values = [
                str(value)
                for value in source_series[df[column].isna() & source_series.notna()].head(5).tolist()
            ]

            actions.append(
                self.build_action(
                    transformation="convert_datetime",
                    column=column,
                    description="Date-like values were converted to datetime64.",
                    confidence=round(success_ratio, 3),
                    affected_rows=parsed_count,
                    previous_dtype=previous_dtype,
                    new_dtype=str(df[column].dtype),
                    details={
                        "supported_formats": SUPPORTED_DATE_FORMATS,
                        "failed_conversions": non_null - parsed_count,
                        "failed_examples": failed_values[:5],
                    },
                    recommendation="Review rows that could not be parsed with supported formats.",
                )
            )

        return self.build_result(df, actions)