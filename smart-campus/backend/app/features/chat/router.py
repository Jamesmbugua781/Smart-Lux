"""
features/chat/router.py
========================
POST /api/chat – rate-limited chat completion with session persistence.
GET  /api/chat/sessions – list user / guest chat history sessions.
GET  /api/chat/sessions/{id} – fetch messages for a specific session.
DELETE /api/chat/sessions/{id} – delete session thread.
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session

from app.core.auth import get_optional_current_user
from app.core.config import settings
from app.core.database import get_db
from app.features.campus.models import ChatSession, User
from app.features.chat.schemas import ChatRequest, ChatResponse
from app.features.chat.service import ChatService

router = APIRouter(tags=['chat'])
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address, default_limits=[settings.RATE_LIMIT])


@router.post('/chat', response_model=ChatResponse)
@limiter.limit(settings.RATE_LIMIT)
async def create_chat_response(
    request: Request,
    payload: ChatRequest,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_current_user),
) -> ChatResponse:
    """Submit a question and receive an AI-generated answer with history persistence."""
    try:
        return await ChatService().generate_response(payload, db=db, user=user)
    except Exception as error:
        logger.exception('Chat request failed: %s', error)
        return ChatResponse(
            message="Hey there! I'm Smart Lux, your campus assistant. Feel free to ask about courses, VC/Dean offices, past papers, rules, or campus locations.",
            language=payload.language or 'en',
            session_id=payload.session_id,
            is_verified=False,
            confidence=0.8,
            sources=[],
            suggestions=['Where is the library?', 'What student services are available?', 'How do I register courses?'],
        )


@router.get('/chat/sessions')
async def get_sessions(
    institution_id: str = 'dekut',
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_current_user),
):
    """Fetch past chat sessions for authenticated user or guest."""
    user_id = user.id if user else None
    return ChatService.list_user_sessions(user_id=user_id, institution_id=institution_id, db=db)


@router.get('/chat/sessions/{session_id}')
async def get_session_messages(session_id: str, db: Session = Depends(get_db)):
    """Fetch all messages within a specific session thread."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Session not found')
    messages = ChatService.get_session_messages(session_id, db)
    return {'session': session.to_dict(), 'messages': messages}


@router.delete('/chat/sessions/{session_id}')
async def delete_session(session_id: str, db: Session = Depends(get_db)):
    """Delete a chat session and its message history."""
    success = ChatService.delete_session(session_id, db)
    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Could not delete session')
    return {'message': 'Session deleted successfully'}
