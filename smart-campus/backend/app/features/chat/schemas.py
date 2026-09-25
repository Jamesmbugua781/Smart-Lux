"""
features/chat/schemas.py
Pydantic models for chat turns, multi-turn conversation memory,
citations, and confidence scores. All user strings are sanitised.
"""
from __future__ import annotations

from pydantic import BaseModel, Field, field_validator

from app.core.security import sanitise_input


class ChatMessage(BaseModel):
    role: str = Field(..., pattern=r'^(user|assistant|system)$')
    content: str = Field(..., min_length=1, max_length=5000)

    @field_validator('content')
    @classmethod
    def sanitise_content(cls, value: str) -> str:
        return sanitise_input(value.strip())


class Source(BaseModel):
    source: str
    title: str
    snippet: str = ''
    confidence: float = 1.0


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    language: str = Field(default='en', max_length=10)
    history: list[ChatMessage] = Field(default_factory=list)  # Conversation memory

    @field_validator('message')
    @classmethod
    def message_must_be_safe(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError('message must not be blank')
        return sanitise_input(stripped)

    @field_validator('language')
    @classmethod
    def language_must_be_safe(cls, value: str) -> str:
        return sanitise_input(value.strip())


class ChatResponse(BaseModel):
    message: str
    language: str
    is_verified: bool = True
    confidence: float = 1.0
    sources: list[Source] = Field(default_factory=list)
    suggestions: list[str] = Field(default_factory=list)
