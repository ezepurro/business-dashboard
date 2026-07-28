import re

from pandas import DataFrame
from pandas import NA
import pandas as pd

from app.profiling.models.dataset_metadata import DatasetMetadata
from app.transformation.models.base_transformer import BaseTransformer
from app.transformation.models.transformation_result import TransformationResult


NUMERIC_TYPES = {
    "money",
    "currency",
    "numeric_measure",
    "quantity",
    "percentage",
}

IDENTIFIER_TYPES = {
    "identifier",
    "document",
    "product_code",
    "postal_code",
}


def _parse_numeric(value):
    if value is None:
        return NA

    if isinstance(value, float) and value != value:
        return NA

    if isinstance(value, int):
        return float(value)

    if isinstance(value, float):
        return value

    text = str(value).strip()

    if not text:
        return NA

    is_percent = "%" in text

    cleaned = re.sub(r"[^0-9,\.\-]", "", text)

    if not cleaned or cleaned in {"-", ".", ","}:
        return NA

    if "." in cleaned and "," in cleaned:
        if cleaned.rfind(",") > cleaned.rfind("."):
            cleaned = cleaned.replace(".", "").replace(",", ".")
        else:
            cleaned = cleaned.replace(",", "")
    elif "," in cleaned:
        if re.match(r"^-?\d+,\d{1,2}$", cleaned):
            cleaned = cleaned.replace(",", ".")
        else:
            cleaned = cleaned.replace(",", "")
    elif "." in cleaned:
        if re.match(r"^-?\d{1,3}(\.\d{3})+$", cleaned):
            cleaned = cleaned.replace(".", "")

    try:
        numeric = float(cleaned)
    except ValueError:
        return NA

    if is_percent:
        numeric /= 100

    return numeric


class NumericTransformer(BaseTransformer):

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

            if column_metadata.semantic_type in IDENTIFIER_TYPES:
                continue

            should_try = column_metadata.semantic_type in NUMERIC_TYPES or str(df[column].dtype) in {"object", "string"}

            if not should_try:
                continue

            previous_dtype = str(df[column].dtype)

            converted = df[column].map(_parse_numeric)

            non_null = int(df[column].notna().sum())
            parsed = int(converted.notna().sum())

            if non_null == 0 or parsed == 0:
                continue

            ratio = parsed / non_null

            if ratio < 0.7:
                continue

            df[column] = pd.Series(converted, index=df.index).astype("Float64")

            actions.append(
                self.build_action(
                    transformation="convert_numeric",
                    column=column,
                    description="Numeric-like values were normalized and converted to numeric dtype.",
                    confidence=round(ratio, 3),
                    affected_rows=parsed,
                    previous_dtype=previous_dtype,
                    new_dtype=str(df[column].dtype),
                    details={
                        "failed_conversions": non_null - parsed,
                    },
                )
            )

        return self.build_result(df, actions)