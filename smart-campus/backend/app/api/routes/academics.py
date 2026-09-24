from fastapi import APIRouter

from app.schemas.academics import AcademicSectionResponse
from app.services.campus_service import CampusService

router = APIRouter()


@router.get('/academics', response_model=list[AcademicSectionResponse])
async def list_academics():
    academic_items = CampusService().get_academics()
    return [
        AcademicSectionResponse(
            id=str(item['id']),
            title=str(item['title']),
            subtitle=str(item['subtitle']),
            items=[str(value) for value in item['items']],
        )
        for item in academic_items
    ]
