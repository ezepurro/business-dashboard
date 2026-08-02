from app.profiling.models.dataset_profile import DatasetProfile
from pydantic import BaseModel


class ProcessDatasetRequest(BaseModel):

    dataset_id: str

    bucket: str

    object_key: str


class ProcessDatasetResponse(BaseModel):

    profile: DatasetProfile