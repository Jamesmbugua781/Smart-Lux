from pydantic import BaseModel


class CampusLocationResponse(BaseModel):
    id: str
    name: str
    category: str
    description: str
    badge: str
    area: str
