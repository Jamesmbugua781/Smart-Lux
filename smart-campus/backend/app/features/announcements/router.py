from fastapi import APIRouter

from app.features.announcements.schemas import AnnouncementResponse
from app.features.announcements.service import AnnouncementsService

router = APIRouter(tags=['announcements'])


@router.get('/announcements', response_model=list[AnnouncementResponse])
async def list_announcements() -> list[AnnouncementResponse]:
    return AnnouncementsService.get_announcements()
