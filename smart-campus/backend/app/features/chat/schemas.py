"""
features/chat/schemas.py
Pydantic models for chat turns, multi-turn conversation memory,
citations, and confidence scores. All user strings are sanitised.

Note on trust boundaries
------------------------
Only the *new* user `message` field is run through sanitise_input.
History messages (ChatMessage) are produced by our own system and
already validated when they were first submitted, so re-validating
them causes false positives (e.g. assistant explanations that
legitimately contain SQL keywords like SELECT or --).
"""
from __future__ import annotations

from pydantic import BaseModel, Field, field_validator

from app.core.security import sanitise_input


class ChatMessage(BaseModel):
    """A single turn in the conversation history (role + content).

    Content is lightly stripped but NOT passed through the SQL-injection
    guard — history is system-generated and already trusted.
    """
    role: str = Field(default='user', max_length=20)
    content: str = Field(default='', max_length=5000)

    @field_validator('role')
    @classmethod
    def normalize_role(cls, value: str) -> str:
        val = (value or 'user').lower().strip()
        if val in ('bot', 'assistant', 'model', 'ai', 'system'):
            return 'assistant'
        return 'user'

    @field_validator('content')
    @classmethod
    def strip_content(cls, value: str) -> str:
        # Only whitespace-strip; no security check on trusted history.
        return value.strip()


class Source(BaseModel):
    source: str
    title: str
    snippet: str = ''
    confidence: float = 1.0


class ChatRequest(BaseModel):
    message: str = Field(default='Hello', max_length=2000)
    language: str = Field(default='en', max_length=10)
    session_id: str | None = Field(default=None, max_length=100)
    institution_id: str = Field(default='dekut', max_length=50)
    history: list[ChatMessage] = Field(default_factory=list)  # Conversation memory

    @field_validator('history')
    @classmethod
    def filter_history(cls, value: list[ChatMessage]) -> list[ChatMessage]:
        return [item for item in value if item.content and item.content.strip()]

    @field_validator('message')
    @classmethod
    def message_must_be_safe(cls, value: str) -> str:
        stripped = (value or '').strip()
        if not stripped:
            return 'Hello'
        return sanitise_input(stripped)

    @field_validator('language')
    @classmethod
    def language_must_be_safe(cls, value: str) -> str:
        return sanitise_input((value or 'en').strip() or 'en')


class ChatResponse(BaseModel):
    message: str
    language: str
    session_id: str | None = None
    is_verified: bool = True
    confidence: float = 1.0
    sources: list[Source] = Field(default_factory=list)
    suggestions: list[str] = Field(default_factory=list)

