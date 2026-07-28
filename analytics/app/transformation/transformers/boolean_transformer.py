from pandas import DataFrame
from pandas import NA

from app.profiling.models.dataset_metadata import DatasetMetadata
from app.transformation.models.base_transformer import BaseTransformer
from app.transformation.models.transformation_result import TransformationResult
from app.transformation.transformers.utils import normalize_lookup_key


TRUE_VALUES = {
    "si",
    "sí",
    "yes",
    "true",
    "1",
}

FALSE_VALUES = {
    "no",
    "false",
    "0",
}


class BooleanTransformer(BaseTransformer):

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

            if column_metadata is None or column_metadata.semantic_type != "boolean":
                continue

            previous_dtype = str(df[column].dtype)

            def parse_value(value):
                if value is None:
                    return NA

                if isinstance(value, float) and value != value:
                    return NA

                token = normalize_lookup_key(str(value))

                if token in TRUE_VALUES:
                    return True

                if token in FALSE_VALUES:
                    return False

                return NA

            converted = df[column].map(parse_value)
            recognized = int(converted.notna().sum())
            non_null = int(df[column].notna().sum())

            if non_null == 0 or recognized == 0:
                continue

            success_ratio = recognized / non_null

            if success_ratio < 0.7:
                continue

            df[column] = converted.astype("boolean")

            actions.append(
                self.build_action(
                    transformation="convert_boolean",
                    column=column,
                    description="Boolean-like text values were converted to nullable boolean.",
                    confidence=round(success_ratio, 3),
                    affected_rows=recognized,
                    previous_dtype=previous_dtype,
                    new_dtype=str(df[column].dtype),
                    details={
                        "unparsed_values": non_null - recognized,
                    },
                )
            )

        return self.build_result(df, actions)