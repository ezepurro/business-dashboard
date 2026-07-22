from pandas import DataFrame

from app.profiling.models.classification_context import ClassificationContext
from app.profiling.models.column_metadata import ColumnMetadata
from app.profiling.models.dataset_metadata import DatasetMetadata
from app.profiling.analyzers.structure_analyzer import StructureAnalyzer
from app.profiling.analyzers.duplicate_analyzer import DuplicateAnalyzer
from app.profiling.analyzers.dtype_analyzer import DtypeAnalyzer
from app.profiling.analyzers.missing_analyzer import MissingAnalyzer
from app.profiling.analyzers.sample_analyzer import SampleAnalyzer

from app.profiling.classifier.column_classifier import ColumnClassifier

from app.profiling.models.dataset_profile import DatasetProfile


class DatasetProfiler:

    def __init__(self):

        self.structure = StructureAnalyzer()
        self.duplicates = DuplicateAnalyzer()
        self.dtypes = DtypeAnalyzer()
        self.missing = MissingAnalyzer()
        self.sample = SampleAnalyzer()

        self.classifier = ColumnClassifier()

    def profile(
        self,
        df: DataFrame
    ) -> DatasetProfile:

        structure = self.structure.analyze(df)

        classified_columns = []
        metadata_columns = []

        for column in df.columns:

            series = df[column]

            context = ClassificationContext(

                column_name=column,

                dtype=str(series.dtype),

                unique_values=int(series.nunique()),

                total_rows=len(df),

                null_percentage=round(float(series.isna().mean()), 3),

                sample_values=[
                    str(value)
                    for value in series.dropna().head(5).tolist()
                ]

            )

            classification = self.classifier.classify(context)

            classified_columns.append(classification)

            metadata_columns.append(

                ColumnMetadata(

                    name=column,

                    semantic_type=classification.semantic_type or "unknown",

                    confidence=classification.confidence,

                    dtype=context.dtype,

                    nullable=context.null_percentage > 0,

                    null_percentage=context.null_percentage,

                    unique_values=context.unique_values,

                    sample_values=context.sample_values

                )

            )

        metadata = DatasetMetadata(

            rows=structure["rows"],

            columns=structure["columns"],

            data_dictionary=metadata_columns

        )

        return DatasetProfile(

            rows=structure["rows"],

            columns=structure["columns"],

            duplicate_rows=self.duplicates.analyze(df),

            dtypes=self.dtypes.analyze(df),

            missing_values=self.missing.analyze(df),

            sample=self.sample.analyze(df),

            classified_columns=classified_columns,

            metadata=metadata

        )