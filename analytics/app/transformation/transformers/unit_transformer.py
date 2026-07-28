import re

from pandas import DataFrame
import pandas as pd

from app.profiling.models.dataset_metadata import DatasetMetadata
from app.transformation.models.base_transformer import BaseTransformer
from app.transformation.models.transformation_result import TransformationResult
from app.transformation.transformers.numeric_transformer import _parse_numeric
from app.transformation.transformers.utils import normalize_lookup_key


UNIT_PATTERN = re.compile(r"^\s*([-+]?\d+[\.,]?\d*)\s*([a-zA-Z]+)\s*$")

UNIT_ALIASES = {
    "kg": "kg",
    "kilo": "kg",
    "kilos": "kg",
    "g": "g",
    "gr": "g",
    "gramos": "g",
    "cm": "cm",
    "mm": "mm",
    "m": "m",
    "l": "l",
    "lt": "l",
    "litro": "l",
    "litros": "l",
}


class UnitTransformer(BaseTransformer):

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

            if str(df[column].dtype) not in {"object", "string", "str"}:
                continue

            matches = []

            for value in df[column].dropna().tolist():
                text = str(value)
                match = UNIT_PATTERN.match(text)

                if match:
                    matches.append(match.groups())

            non_null = int(df[column].notna().sum())

            if non_null == 0:
                continue

            if len(matches) / non_null < 0.7:
                continue

            previous_dtype = str(df[column].dtype)

            value_column_name = f"{column}_value"
            unit_column_name = f"{column}_unit"

            numeric_values = []
            unit_values = []

            for value in df[column].tolist():
                if value is None or (isinstance(value, float) and value != value):
                    numeric_values.append(pd.NA)
                    unit_values.append(pd.NA)
                    continue

                text = str(value)
                match = UNIT_PATTERN.match(text)

                if not match:
                    numeric_values.append(pd.NA)
                    unit_values.append(pd.NA)
                    continue

                raw_number, raw_unit = match.groups()

                numeric_values.append(_parse_numeric(raw_number))
                unit_values.append(UNIT_ALIASES.get(normalize_lookup_key(raw_unit), raw_unit.lower()))

            df[value_column_name] = pd.Series(numeric_values, index=df.index).astype("Float64")
            df[unit_column_name] = pd.Series(unit_values, index=df.index).astype("string")
            df = df.drop(columns=[column])

            actions.append(
                self.build_action(
                    transformation="split_value_and_unit",
                    column=column,
                    description="Column with units was split into numeric value and unit columns.",
                    confidence=0.9,
                    affected_rows=len(matches),
                    previous_dtype=previous_dtype,
                    new_dtype=f"{df[value_column_name].dtype} + {df[unit_column_name].dtype}",
                    details={
                        "value_column": value_column_name,
                        "unit_column": unit_column_name,
                    },
                )
            )

        return self.build_result(df, actions)