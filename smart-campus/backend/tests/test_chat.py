from fastapi.testclient import TestClient

from app.api.routes import chat as chat_route
from app.main import app
from app.schemas.chat import ChatResponse, Source


client = TestClient(app)


def test_chat_rejects_blank_message():
    response = client.post('/api/chat', json={'message': '   ', 'language': 'en'})

    assert response.status_code == 422


def test_chat_endpoint_uses_chat_service(monkeypatch):
    class FakeChatService:
        async def generate_response(self, request):
            return ChatResponse(
                message=f'Answer for {request.message}',
                language=request.language,
                sources=[Source(source='Demo Campus Directory', title='University Library')],
                suggestions=['Where is the library?'],
            )

    monkeypatch.setattr(chat_route, 'ChatService', FakeChatService)

    response = client.post('/api/chat', json={'message': 'Where is the library?', 'language': 'en'})

    assert response.status_code == 200
    assert response.json() == {
        'message': 'Answer for Where is the library?',
        'language': 'en',
        'sources': [{'source': 'Demo Campus Directory', 'title': 'University Library'}],
        'suggestions': ['Where is the library?'],
    }
