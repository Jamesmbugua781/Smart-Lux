from fastapi import APIRouter, HTTPException

from app.schemas.campus import CampusLocationResponse
from app.services.campus_service import CampusService

router = APIRouter()


@router.get('/campus', response_model=list[CampusLocationResponse])
async def list_campus_locations():
    return CampusService().get_locations()


@router.get('/campus/{location_id}', response_model=CampusLocationResponse)
async def get_campus_location(location_id: str):
    location = CampusService().get_location(location_id)
    if not location:
        raise HTTPException(status_code=404, detail='Campus location not found.')
    return location
