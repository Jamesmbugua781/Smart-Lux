from pydantic import BaseModel


class AcademicSectionResponse(BaseModel):
    id: str
    title: str
    subtitle: str
    items: list[str]
