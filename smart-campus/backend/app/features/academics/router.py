from fastapi import APIRouter

from app.features.academics.schemas import AcademicSectionResponse
from app.features.academics.service import AcademicsService

router = APIRouter(tags=['academics'])


@router.get('/academics', response_model=list[AcademicSectionResponse])
async def list_academics() -> list[AcademicSectionResponse]:
    return AcademicsService.get_academics()
