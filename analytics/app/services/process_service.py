from app.profiling.profiler import DatasetProfiler
from app.ingestion.dataset_loader import DatasetLoader


class ProcessService:

    def __init__(self):
        self.loader = DatasetLoader()
        self.profiler = DatasetProfiler()

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

        # 2. Generar el perfil del dataset
        profile = self.profiler.profile(df)

        # 3. Mostrar el resultado (temporalmente)
        print(profile.model_dump_json(indent=2))