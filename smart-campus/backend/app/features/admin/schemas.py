from __future__ import annotations

from pydantic import BaseModel, Field


class CreateInstitutionRequest(BaseModel):
    id: str = Field(..., max_length=50)
    code: str = Field(..., max_length=20)
    name: str = Field(..., max_length=255)
    city: str = Field(default='', max_length=100)
    description: str = Field(default='')


class DirectTextUploadRequest(BaseModel):
    filename: str = Field(..., max_length=255)
    content: str = Field(..., min_length=10)
    file_type: str = Field(default='txt', max_length=20)
    institution_id: str = Field(default='dekut', max_length=50)
