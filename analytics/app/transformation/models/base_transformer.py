from abc import ABC, abstractmethod

from pandas import DataFrame

from app.profiling.models.column_metadata import ColumnMetadata
from app.profiling.models.dataset_metadata import DatasetMetadata
from app.transformation.models.transformation_action import TransformationAction
from app.transformation.models.transformation_result import TransformationResult


class BaseTransformer(ABC):

    @abstractmethod
    def transform(
        self,
        df: DataFrame,
        metadata: DatasetMetadata
    ) -> TransformationResult:
        pass

    @staticmethod
    def build_action(
        transformation: str,
        description: str,
        confidence: float,
        column: str | None = None,
        affected_rows: int | None = None,
        previous_dtype: str | None = None,
        new_dtype: str | None = None,
        recommendation: str | None = None,
        details: dict | None = None,
    ) -> TransformationAction:
        return TransformationAction(
            transformation=transformation,
            column=column,
            description=description,
            confidence=confidence,
            affected_rows=affected_rows,
            previous_dtype=previous_dtype,
            new_dtype=new_dtype,
            recommendation=recommendation,
            details=details,
        )

    @staticmethod
    def build_result(
        dataframe: DataFrame,
        actions: list[TransformationAction]
    ) -> TransformationResult:
        return TransformationResult(
            dataframe=dataframe,
            actions=actions,
        )

    @staticmethod
    def metadata_by_column(
        metadata: DatasetMetadata
    ) -> dict[str, ColumnMetadata]:
        return {
            column.name: column
            for column in metadata.data_dictionary
        }