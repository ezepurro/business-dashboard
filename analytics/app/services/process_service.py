from app.profiling.profiler import DatasetProfiler
from app.ingestion.dataset_loader import DatasetLoader
from app.cleaning.cleaning_engine import CleaningEngine
from app.transformation.transformation_engine import TransformationEngine
from app.analytics.analytics_engine import AnalyticsEngine


class ProcessService:

    def __init__(self):
        self.loader = DatasetLoader()
        self.cleaning = CleaningEngine()
        self.profiler = DatasetProfiler()
        self.transformation = TransformationEngine()
        self.analytics = AnalyticsEngine()

    async def process(
        self,
        dataset_id: str,
        bucket: str,
        object_key: str
    ) -> None:

        print(f"Processing dataset {dataset_id}...")

        # 1. Descargar y cargar el dataset desde MinIO
        df = self.loader.load_dataframe(
            bucket=bucket,
            object_key=object_key
        )

        # 2. Limpiar el dataset con el pipeline seguro
        cleaning_report = self.cleaning.clean(df)

        # 3. Generar el perfil sobre el DataFrame ya limpio
        profile = self.profiler.profile(
            cleaning_report.dataframe,
            cleaning_report=cleaning_report
        )

        # 4. Transformar el dataset usando metadata del perfil
        transformation_report = self.transformation.transform(
            cleaning_report.dataframe,
            profile.metadata
        )

        profile.transformation = transformation_report

        # 5. Extraer métricas de negocio desde el dataset transformado
        analytics_report = self.analytics.analyze(
            transformation_report.dataframe,
            profile.metadata
        )

        profile.analytics = analytics_report

        # 6. Mostrar el resultado (temporalmente)
        print(profile.model_dump_json(indent=2))