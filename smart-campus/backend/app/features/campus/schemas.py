"""
features/campus/schemas.py
Pydantic schemas for campus locations, knowledge base management,
and document ingestion pipeline. Includes sanitisation for all text inputs.
"""
from __future__ import annotations

from pydantic import BaseModel, Field, field_validator
from app.core.security import sanitise_input


class CampusLocationResponse(BaseModel):
    id: str
    name: str
    category: str
    description: str
    badge: str
    area: str


class KnowledgeItemCreate(BaseModel):
    category: str = Field(..., min_length=1, max_length=100)
    name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1, max_length=5000)
    location: str = Field(default='', max_length=255)
    source: str = Field(default='', max_length=255)
    keywords: list[str] = Field(default_factory=list)

    @field_validator('category', 'name', 'description', 'location', 'source')
    @classmethod
    def sanitise_fields(cls, value: str) -> str:
        if not value:
            return value
        return sanitise_input(value.strip())


class KnowledgeItemResponse(BaseModel):
    id: int
    category: str
    name: str
    description: str
    location: str
    source: str
    keywords: list[str] = Field(default_factory=list)


class DocumentIngestRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    category: str = Field(default='documents', max_length=100)
    source: str = Field(default='Uploaded Handbook', max_length=255)

    @field_validator('title', 'category', 'source')
    @classmethod
    def sanitise_fields(cls, value: str) -> str:
        if not value:
            return value
        return sanitise_input(value.strip())


class DocumentIngestResponse(BaseModel):
    message: str
    title: str
    total_chunks: int
    chunk_ids: list[int]
