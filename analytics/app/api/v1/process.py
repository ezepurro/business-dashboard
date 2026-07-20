from fastapi import APIRouter, status

from app.schemas.process import (
    ProcessDatasetRequest,
    ProcessDatasetResponse
)

from app.services.process_service import ProcessService

router = APIRouter(prefix="/api/v1", tags=["Processing"])

service = ProcessService()


@router.post(
    "/process",
    response_model=ProcessDatasetResponse,
    status_code=status.HTTP_202_ACCEPTED
)
async def process_dataset(request: ProcessDatasetRequest):

    await service.process(
        request.dataset_id,
        request.bucket,
        request.object_key
    )

    return ProcessDatasetResponse(
        status="accepted"
    )