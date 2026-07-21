from minio import Minio
from minio.datatypes import Object

from app.core.config import settings


class MinIOClient:
    def __init__(self):
        self.client = Minio(
            endpoint=settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE,
        )

    def get_object(self, bucket: str, object_key: str) -> Object:
        return self.client.get_object(bucket, object_key)