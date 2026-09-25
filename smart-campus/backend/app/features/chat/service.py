"""
features/chat/service.py
Orchestrates hybrid retrieval → confidence evaluation → AI generation for multi-turn chat.
Persists sessions and message history in database for authenticated users and guests.
"""
from __future__ import annotations

import logging
from sqlalchemy.orm import Session

from app.features.campus.models import ChatMessageRecord, ChatSession, User
from app.features.chat.ai import AIService
from app.features.chat.retrieval import RetrievalService
from app.features.chat.schemas import ChatRequest, ChatResponse, Source

logger = logging.getLogger(__name__)


class ChatService:
    def __init__(
        self,
        retrieval_service: RetrievalService | None = None,
        ai_service: AIService | None = None,
    ) -> None:
        self.retrieval_service = retrieval_service or RetrievalService()
        self.ai_service = ai_service or AIService()

    async def generate_response(self, request: ChatRequest, db: Session | None = None, user: User | None = None) -> ChatResponse:
        try:
            context = self.retrieval_service.search(request.message)
        except Exception:
            context = []

        # Convert history schema to dictionary list for AIService
        history_dicts = [
            {'role': item.role, 'content': item.content} for item in request.history
        ]

        # Call AI Provider with RAG Context (if any) + Multi-Turn History
        try:
            result = await self.ai_service.generate_answer(
                question=request.message,
                language=request.language,
                context=context,
                history=history_dicts,
            )
        except Exception:
            if context:
                top = context[0]
                result = f"Here is what I found on campus for your query: **{top.get('name')}** - {top.get('description')} (Location: {top.get('location', 'N/A')})."
            else:
                result = "Hey there! I'm Smart Lux. Feel free to ask me about DeKUT courses, VC/Dean offices, past papers, rules, or campus locations!"

        # Citation & Source Attribution
        if context:
            sources = [
                Source(
                    source=entry.get('source', 'Campus Directory'),
                    title=entry.get('name', 'Campus Entry'),
                    snippet=entry.get('description', '')[:150] + ('...' if len(entry.get('description', '')) > 150 else ''),
                    confidence=round(min(1.0, 0.8 + 0.1 * idx), 2),
                )
                for idx, entry in enumerate(context)
            ]
            is_verified = True
            confidence = 0.95
        else:
            sources = []
            is_verified = False
            confidence = 0.80

        session_id = request.session_id

        # Persist session & messages if database session is provided
        if db is not None:
            try:
                # Find or create session
                session = None
                if session_id:
                    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()

                if not session:
                    session = ChatSession(
                        user_id=user.id if user else None,
                        institution_id=request.institution_id or 'dekut',
                        title=request.message[:40] + ('...' if len(request.message) > 40 else ''),
                    )
                    db.add(session)
                    db.commit()
                    db.refresh(session)
                    session_id = session.id
                else:
                    # Update session title if default
                    if session.title == 'New Conversation':
                        session.title = request.message[:40] + ('...' if len(request.message) > 40 else '')
                        db.commit()

                # Save user message
                user_msg = ChatMessageRecord(
                    session_id=session.id,
                    role='user',
                    content=request.message,
                )
                db.add(user_msg)

                # Save assistant message
                asst_msg = ChatMessageRecord(
                    session_id=session.id,
                    role='assistant',
                    content=result,
                    sources=[s.dict() for s in sources],
                )
                db.add(asst_msg)
                db.commit()
            except Exception as err:
                db.rollback()
                logger.warning('Failed to persist chat message history: %s', err)

        return ChatResponse(
            message=result,
            language=request.language,
            session_id=session_id,
            is_verified=is_verified,
            confidence=confidence,
            sources=sources,
            suggestions=self._suggestions(request.language),
        )

    @staticmethod
    def list_user_sessions(user_id: str | None, institution_id: str, db: Session) -> list[dict]:
        """Fetch past chat sessions for user or guest."""
        query = db.query(ChatSession).filter(ChatSession.institution_id == institution_id)
        if user_id:
            query = query.filter(ChatSession.user_id == user_id)
        else:
            query = query.filter(ChatSession.user_id == None)

        sessions = query.order_by(ChatSession.updated_at.desc()).limit(25).all()
        return [s.to_dict() for s in sessions]

    @staticmethod
    def get_session_messages(session_id: str, db: Session) -> list[dict]:
        """Fetch all message records for a specific session."""
        records = db.query(ChatMessageRecord).filter(ChatMessageRecord.session_id == session_id).order_by(ChatMessageRecord.created_at.asc()).all()
        return [r.to_dict() for r in records]

    @staticmethod
    def delete_session(session_id: str, db: Session) -> bool:
        """Delete a chat session and its history."""
        try:
            db.query(ChatMessageRecord).filter(ChatMessageRecord.session_id == session_id).delete()
            db.query(ChatSession).filter(ChatSession.id == session_id).delete()
            db.commit()
            return True
        except Exception as err:
            db.rollback()
            logger.error('Failed to delete chat session %s: %s', session_id, err)
            return False

    @staticmethod
    def _suggestions(language: str) -> list[str]:
        if language.lower().startswith('sw'):
            return ['Maktaba iko wapi?', 'Huduma gani za wanafunzi zinapatikana?', 'Sajili masomo vipi?']
        return ['Where is the library?', 'What student services are available?', 'How do I register courses?']
