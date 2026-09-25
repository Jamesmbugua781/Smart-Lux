"""
features/chat/router.py
POST /api/chat – rate-limited to prevent brute-force / abuse.

Rate limiting is applied per client IP using slowapi.
The limit is driven by settings.RATE_LIMIT (default "10/minute").
"""

import logging

from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import settings
from app.features.chat.schemas import ChatRequest, ChatResponse
from app.features.chat.service import ChatService

router = APIRouter(tags=['chat'])
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address, default_limits=[settings.RATE_LIMIT])


@router.post('/chat', response_model=ChatResponse)
@limiter.limit(settings.RATE_LIMIT)
async def create_chat_response(request: Request, payload: ChatRequest) -> ChatResponse:
    """
    Submit a student question and receive an AI-generated campus answer.

    Rate-limited per IP to prevent brute-force enumeration and abuse.
    Input is sanitised against XSS and SQL-injection at the schema layer.
    """
    try:
        return await ChatService().generate_response(payload)
    except Exception as error:
        logger.exception('Chat request failed: %s', error)
        return ChatResponse(
            message="Hey there! I'm Smart Lux, your DeKUT campus assistant. I'm right here to help! Feel free to ask about DeKUT courses, VC/Dean offices, past papers, rules, or campus locations.",
            language=payload.language or 'en',
            is_verified=False,
            confidence=0.8,
            sources=[],
            suggestions=['Where is the library?', 'What student services are available?', 'How do I register courses?'],
        )
