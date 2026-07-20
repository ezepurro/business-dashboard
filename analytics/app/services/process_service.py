class ProcessService:

    async def process(
        self,
        dataset_id: str,
        bucket: str,
        object_key: str
    ) -> None:

        print(f"Dataset: {dataset_id}")
        print(f"Bucket: {bucket}")
        print(f"Object: {object_key}")