from pandas import DataFrame

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

        return DatasetProfile(

            rows=structure["rows"],

            columns=structure["columns"],

            duplicate_rows=self.duplicates.analyze(df),

            dtypes=self.dtypes.analyze(df),

            missing_values=self.missing.analyze(df),

            sample=self.sample.analyze(df),

            classified_columns=self.classifier.classify(df)
        )