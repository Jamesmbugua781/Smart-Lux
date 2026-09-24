from fastapi import APIRouter

from app.schemas.announcements import AnnouncementResponse
from app.services.campus_service import CampusService

router = APIRouter()


@router.get('/announcements', response_model=list[AnnouncementResponse])
async def list_announcements():
    return CampusService().get_announcements()
