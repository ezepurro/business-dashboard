from pandas import DataFrame
from pandas import NA

from app.profiling.models.dataset_metadata import DatasetMetadata
from app.transformation.models.base_transformer import BaseTransformer
from app.transformation.models.transformation_result import TransformationResult
from app.transformation.transformers.utils import collapse_spaces


IDENTIFIER_TYPES = {
    "identifier",
    "document",
    "product_code",
    "postal_code",
}


def _as_identifier_string(value) -> str | None:
    if value is None:
        return None

    if isinstance(value, float) and value != value:
        return None

    if isinstance(value, float) and value.is_integer():
        return str(int(value))

    return collapse_spaces(str(value))


class IdentifierTransformer(BaseTransformer):

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

            if column_metadata.semantic_type not in IDENTIFIER_TYPES:
                continue

            previous_dtype = str(df[column].dtype)

            normalized = df[column].map(_as_identifier_string)
            normalized = normalized.where(normalized.notna(), NA)

            changed = int((df[column].astype("string") != normalized.astype("string")).fillna(False).sum())

            df[column] = normalized.astype("string")

            actions.append(
                self.build_action(
                    transformation="preserve_identifier_as_string",
                    column=column,
                    description="Identifier column was preserved as text to avoid semantic loss.",
                    confidence=0.99,
                    affected_rows=changed,
                    previous_dtype=previous_dtype,
                    new_dtype=str(df[column].dtype),
                    recommendation="Keep identifier columns as strings even if they look numeric.",
                )
            )

        return self.build_result(df, actions)