from fastapi import APIRouter

from app.features.health.schemas import HealthResponse

router = APIRouter(tags=['health'])


@router.get('/health', response_model=HealthResponse)
async def healthcheck() -> HealthResponse:
    return HealthResponse(status='ok', service='smart-campus-api')
