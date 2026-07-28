from pandas import DataFrame

from app.profiling.models.dataset_metadata import DatasetMetadata
from app.transformation.models.base_transformer import BaseTransformer
from app.transformation.models.transformation_report import TransformationReport
from app.transformation.transformers.boolean_transformer import BooleanTransformer
from app.transformation.transformers.category_transformer import CategoryTransformer
from app.transformation.transformers.date_transformer import DateTransformer
from app.transformation.transformers.enum_transformer import EnumTransformer
from app.transformation.transformers.geographic_transformer import GeographicTransformer
from app.transformation.transformers.identifier_transformer import IdentifierTransformer
from app.transformation.transformers.numeric_transformer import NumericTransformer
from app.transformation.transformers.unit_transformer import UnitTransformer


class TransformationEngine:

    def __init__(
        self,
        transformers: list[BaseTransformer] | None = None
    ):

        # Order is important to avoid semantic conflicts between transformers.
        self.transformers = transformers or [
            IdentifierTransformer(),
            UnitTransformer(),
            BooleanTransformer(),
            DateTransformer(),
            NumericTransformer(),
            GeographicTransformer(),
            EnumTransformer(),
            CategoryTransformer(),
        ]

    def transform(
        self,
        df: DataFrame,
        metadata: DatasetMetadata
    ) -> TransformationReport:

        working_df = df.copy()
        actions = []

        for transformer in self.transformers:
            result = transformer.transform(working_df, metadata)
            working_df = result.dataframe
            actions.extend(result.actions)

        return TransformationReport(
            dataframe=working_df,
            actions=actions,
        )