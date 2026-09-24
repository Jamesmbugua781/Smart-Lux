from pydantic import BaseModel


class AnnouncementResponse(BaseModel):
    id: str
    title: str
    date: str
    category: str
    summary: str
