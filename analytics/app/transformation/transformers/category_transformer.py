from pandas import DataFrame

from app.profiling.models.dataset_metadata import DatasetMetadata
from app.transformation.models.base_transformer import BaseTransformer
from app.transformation.models.transformation_result import TransformationResult


EXCLUDED_TYPES = {
    "identifier",
    "document",
    "product_code",
    "postal_code",
    "date",
    "datetime",
    "numeric_measure",
    "quantity",
    "currency",
    "money",
}


class CategoryTransformer(BaseTransformer):

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

            if column_metadata.semantic_type in EXCLUDED_TYPES:
                continue

            if str(df[column].dtype) == "category":
                continue

            non_null = int(df[column].notna().sum())

            if non_null == 0:
                continue

            unique_ratio = column_metadata.unique_values / max(non_null, 1)

            if not (
                column_metadata.unique_values <= 50
                and unique_ratio <= 0.6
            ):
                continue

            previous_dtype = str(df[column].dtype)
            df[column] = df[column].astype("category")

            actions.append(
                self.build_action(
                    transformation="convert_category",
                    column=column,
                    description="Low-cardinality column was converted to category dtype.",
                    confidence=0.88,
                    affected_rows=non_null,
                    previous_dtype=previous_dtype,
                    new_dtype=str(df[column].dtype),
                    details={
                        "unique_values": column_metadata.unique_values,
                        "unique_ratio": round(unique_ratio, 4),
                    },
                )
            )

        return self.build_result(df, actions)