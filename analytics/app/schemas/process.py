from pydantic import BaseModel


class ProcessDatasetRequest(BaseModel):
    dataset_id: str
    bucket: str
    object_key: str


class ProcessDatasetResponse(BaseModel):
    status: str