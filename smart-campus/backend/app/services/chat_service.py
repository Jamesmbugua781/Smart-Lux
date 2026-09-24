from app.schemas.chat import ChatRequest, ChatResponse, Source
from app.services.ai_service import AIService
from app.services.retrieval_service import RetrievalService


class ChatService:
    def __init__(self, retrieval_service: RetrievalService | None = None, ai_service: AIService | None = None):
        self.retrieval_service = retrieval_service or RetrievalService()
        self.ai_service = ai_service or AIService()

    async def generate_response(self, request: ChatRequest) -> ChatResponse:
        context = self.retrieval_service.search(request.message)
        result = await self.ai_service.generate_answer(request.message, request.language, context)
        sources = [Source(source=entry['source'], title=entry['name']) for entry in context]
        return ChatResponse(
            message=result,
            language=request.language,
            sources=sources,
            suggestions=self._suggestions(request.language),
        )

    @staticmethod
    def _suggestions(language: str) -> list[str]:
        if language.lower().startswith('sw'):
            return ['Maktaba iko wapi?', 'Huduma gani za wanafunzi zinapatikana?']
        return ['Where is the library?', 'What student services are available?']
