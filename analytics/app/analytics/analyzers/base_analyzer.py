from abc import ABC, abstractmethod

from pandas import DataFrame

from app.analytics.models.analysis_result import AnalysisResult
from app.profiling.models.dataset_metadata import DatasetMetadata
from app.profiling.models.column_metadata import ColumnMetadata


DATE_SEMANTIC_TYPES = {"date", "datetime"}
NUMERIC_SEMANTIC_TYPES = {"sales", "amount", "money", "currency", "numeric_measure", "quantity"}
ENTITY_SEMANTIC_TYPES = {"customer", "product"}
CATEGORY_SEMANTIC_TYPES = {"categorical"}
GEOGRAPHIC_SEMANTIC_TYPES = {"location", "country", "region"}
SPECIAL_CATEGORY_SEMANTIC_TYPES = {"payment_method", "status", "gender", "channel"}


class BaseAnalyzer(ABC):

    @abstractmethod
    def analyze(
        self,
        df: DataFrame,
        metadata: DatasetMetadata
    ) -> AnalysisResult:
        pass

    @staticmethod
    def metadata_map(metadata: DatasetMetadata) -> dict[str, ColumnMetadata]:
        return {column.name: column for column in metadata.data_dictionary}

    @staticmethod
    def columns_with_semantic_types(
        metadata: DatasetMetadata,
        semantic_types: set[str]
    ) -> list[str]:
        return [
            column.name
            for column in metadata.data_dictionary
            if column.semantic_type in semantic_types
        ]

    @staticmethod
    def first_column_with_semantic_types(
        metadata: DatasetMetadata,
        semantic_types: set[str]
    ) -> str | None:
        for column in metadata.data_dictionary:
            if column.semantic_type in semantic_types:
                return column.name

        return None

    @staticmethod
    def first_columns_with_semantic_types(
        metadata: DatasetMetadata,
        semantic_types: set[str]
    ) -> list[str]:
        return BaseAnalyzer.columns_with_semantic_types(metadata, semantic_types)