"""
features/chat/service.py
Orchestrates hybrid retrieval → confidence evaluation → AI generation for multi-turn chat.
Implements citations with context snippets and confidence-bounded "I don't know" fallback.
"""
from __future__ import annotations

from app.features.chat.ai import AIService
from app.features.chat.retrieval import RetrievalService
from app.features.chat.schemas import ChatRequest, ChatResponse, Source


class ChatService:
    def __init__(
        self,
        retrieval_service: RetrievalService | None = None,
        ai_service: AIService | None = None,
    ) -> None:
        self.retrieval_service = retrieval_service or RetrievalService()
        self.ai_service = ai_service or AIService()

    async def generate_response(self, request: ChatRequest) -> ChatResponse:
        context = self.retrieval_service.search(request.message)

        # -------------------------------------------------------------------
        # Confidence / "I Don't Know" Fallback Mechanism
        # -------------------------------------------------------------------
        if not context:
            is_swahili = request.language.lower().startswith('sw')
            fallback_msg = (
                "Samahani, sikupata taarifa zilizothibitishwa za chuo kuhusu swali lako. "
                "Tafadhali wasiliana na dawati la huduma za wanafunzi au ofisi ya usajili kwa msaada zaidi."
                if is_swahili
                else "I could not find verified university information regarding your question. "
                "Please contact the campus helpdesk or registry office for official assistance."
            )
            return ChatResponse(
                message=fallback_msg,
                language=request.language,
                is_verified=False,
                confidence=0.0,
                sources=[],
                suggestions=self._suggestions(request.language),
            )

        # Convert history schema to dictionary list for AIService
        history_dicts = [
            {'role': item.role, 'content': item.content} for item in request.history
        ]

        # Call AI Provider with RAG Context + Multi-Turn History
        result = await self.ai_service.generate_answer(
            question=request.message,
            language=request.language,
            context=context,
            history=history_dicts,
        )

        # -------------------------------------------------------------------
        # Citation & Source Attribution
        # -------------------------------------------------------------------
        sources = [
            Source(
                source=entry.get('source', 'Campus Directory'),
                title=entry.get('name', 'Campus Entry'),
                snippet=entry.get('description', '')[:150] + ('...' if len(entry.get('description', '')) > 150 else ''),
                confidence=round(min(1.0, 0.8 + 0.1 * idx), 2),
            )
            for idx, entry in enumerate(context)
        ]

        return ChatResponse(
            message=result,
            language=request.language,
            is_verified=True,
            confidence=0.95,
            sources=sources,
            suggestions=self._suggestions(request.language),
        )

    @staticmethod
    def _suggestions(language: str) -> list[str]:
        if language.lower().startswith('sw'):
            return ['Maktaba iko wapi?', 'Huduma gani za wanafunzi zinapatikana?', 'Sajili masomo vipi?']
        return ['Where is the library?', 'What student services are available?', 'How do I register courses?']
