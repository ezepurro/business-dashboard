from fastapi import APIRouter, status
from app.profiling.models.dataset_profile import DatasetProfile

from app.schemas.process import (
    ProcessDatasetRequest
)

from app.services.process_service import ProcessService

router = APIRouter(
    prefix="/api/v1",
    tags=["Processing"]
)

service = ProcessService()


@router.post(
    "/process",
    response_model=DatasetProfile,
    status_code=status.HTTP_200_OK
)
async def process_dataset(
    request: ProcessDatasetRequest
):

    return await service.process(

        request.dataset_id,

        request.bucket,

        request.object_key

    )