from pandas import DataFrame

from app.profiling.models.dataset_metadata import DatasetMetadata
from app.transformation.models.base_transformer import BaseTransformer
from app.transformation.models.transformation_result import TransformationResult
from app.transformation.transformers.utils import normalize_lookup_key, title_text


GEOGRAPHIC_TYPES = {
    "location",
}

GEO_RULES = {
    "bs as": "Buenos Aires",
    "buenos aires": "Buenos Aires",
    "caba": "Ciudad Autonoma De Buenos Aires",
    "capital federal": "Ciudad Autonoma De Buenos Aires",
    "capital": "Ciudad Autonoma De Buenos Aires",
}


class GeographicTransformer(BaseTransformer):

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

            if column_metadata is None or column_metadata.semantic_type not in GEOGRAPHIC_TYPES:
                continue

            previous_dtype = str(df[column].dtype)

            def normalize_geo(value):
                if value is None:
                    return value

                if isinstance(value, float) and value != value:
                    return value

                text = str(value)
                key = normalize_lookup_key(text)

                if key in GEO_RULES:
                    return GEO_RULES[key]

                return title_text(text)

            normalized = df[column].map(normalize_geo)
            changed = int((df[column].astype("string") != normalized.astype("string")).fillna(False).sum())

            if changed == 0:
                continue

            df[column] = normalized

            actions.append(
                self.build_action(
                    transformation="normalize_geography",
                    column=column,
                    description="Geographic names were normalized using configured rules.",
                    confidence=0.9,
                    affected_rows=changed,
                    previous_dtype=previous_dtype,
                    new_dtype=str(df[column].dtype),
                )
            )

        return self.build_result(df, actions)