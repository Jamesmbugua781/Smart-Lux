from pydantic import BaseModel, Field, field_validator


class Source(BaseModel):
    source: str
    title: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    language: str = 'en'

    @field_validator('message')
    @classmethod
    def message_must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError('message must not be blank')
        return value.strip()


class ChatResponse(BaseModel):
    message: str
    language: str
    sources: list[Source] = Field(default_factory=list)
    suggestions: list[str] = Field(default_factory=list)
