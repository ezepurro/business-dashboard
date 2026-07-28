from pandas import DataFrame

from app.profiling.models.dataset_metadata import DatasetMetadata
from app.transformation.models.base_transformer import BaseTransformer
from app.transformation.models.transformation_result import TransformationResult
from app.transformation.transformers.utils import normalize_lookup_key, title_text


ENUM_TYPES = {
    "payment_method",
    "status",
    "gender",
    "channel",
    "country",
    "region",
}

ENUM_NORMALIZATION: dict[str, dict[str, str]] = {
    "payment_method": {
        "mercado pago": "Mercado Pago",
        "mercadopago": "Mercado Pago",
        "mp": "Mercado Pago",
        "transferencia": "Transferencia",
        "cash": "Efectivo",
    },
    "status": {
        "active": "Activo",
        "activo": "Activo",
        "inactive": "Inactivo",
        "inactivo": "Inactivo",
    },
    "gender": {
        "male": "Masculino",
        "masculino": "Masculino",
        "m": "Masculino",
        "female": "Femenino",
        "femenino": "Femenino",
        "f": "Femenino",
    },
    "channel": {
        "online": "Online",
        "web": "Online",
        "presencial": "Presencial",
        "store": "Presencial",
        "tienda": "Presencial",
    },
    "country": {
        "ar": "Argentina",
        "argentina": "Argentina",
        "uy": "Uruguay",
        "uruguay": "Uruguay",
        "cl": "Chile",
        "chile": "Chile",
    },
    "region": {
        "north": "Norte",
        "norte": "Norte",
        "south": "Sur",
        "sur": "Sur",
        "center": "Centro",
        "centro": "Centro",
        "west": "Oeste",
        "oeste": "Oeste",
        "east": "Este",
        "este": "Este",
    },
}


class EnumTransformer(BaseTransformer):

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

            semantic = column_metadata.semantic_type

            if semantic not in ENUM_TYPES:
                continue

            previous_dtype = str(df[column].dtype)
            mapping = ENUM_NORMALIZATION.get(semantic, {})

            def normalize_value(value):
                if value is None:
                    return value

                if isinstance(value, float) and value != value:
                    return value

                text = str(value)
                key = normalize_lookup_key(text)

                if key in mapping:
                    return mapping[key]

                return title_text(text)

            normalized = df[column].map(normalize_value)
            changed = int((df[column].astype("string") != normalized.astype("string")).fillna(False).sum())

            if changed == 0 and str(df[column].dtype) == "category":
                continue

            df[column] = normalized.astype("category")

            actions.append(
                self.build_action(
                    transformation="normalize_enum",
                    column=column,
                    description="Enum-like values were normalized and converted to category.",
                    confidence=0.92,
                    affected_rows=changed,
                    previous_dtype=previous_dtype,
                    new_dtype=str(df[column].dtype),
                )
            )

        return self.build_result(df, actions)