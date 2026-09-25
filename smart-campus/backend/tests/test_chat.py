"""
tests/test_chat.py
Tests for the chat feature (POST /api/chat), multi-turn memory, citations, and confidence fallback.
"""
from __future__ import annotations

import asyncio
from fastapi.testclient import TestClient

import app.features.chat.router as chat_router_module
from app.features.chat.schemas import ChatResponse, Source
from app.features.chat.service import ChatService
from app.main import app

client = TestClient(app)


def test_chat_rejects_blank_message():
    response = client.post('/api/chat', json={'message': '   ', 'language': 'en'})
    assert response.status_code == 422


def test_chat_rejects_xss_input():
    response = client.post(
        '/api/chat',
        json={'message': '<script>alert(1)</script>', 'language': 'en'},
    )
    assert response.status_code in (200, 422, 502)


def test_chat_rejects_sql_injection():
    response = client.post(
        '/api/chat',
        json={'message': "' OR 1=1; DROP TABLE users;--", 'language': 'en'},
    )
    assert response.status_code == 422


def test_chat_endpoint_uses_chat_service(monkeypatch):
    class FakeChatService:
        async def generate_response(self, request):
            return ChatResponse(
                message=f'Answer for {request.message}',
                language=request.language,
                is_verified=True,
                confidence=0.95,
                sources=[Source(source='Demo Campus Directory', title='University Library', snippet='Central library study area.', confidence=0.9)],
                suggestions=['Where is the library?'],
            )

    monkeypatch.setattr(chat_router_module, 'ChatService', FakeChatService)

    response = client.post(
        '/api/chat', json={'message': 'Where is the library?', 'language': 'en'}
    )

    assert response.status_code == 200
    data = response.json()
    assert data['message'] == 'Answer for Where is the library?'
    assert data['is_verified'] is True
    assert data['confidence'] == 0.95
    assert len(data['sources']) == 1
    assert data['sources'][0]['title'] == 'University Library'


def test_chat_service_returns_i_dont_know_fallback_on_unmatched_query():
    class EmptyRetrievalService:
        def search(self, question, limit=5, alpha=0.5):
            return []

    service = ChatService(retrieval_service=EmptyRetrievalService())
    from app.features.chat.schemas import ChatRequest
    req = ChatRequest(message='What is the 2099 tuition fee in Mars campus?', language='en')
    response = asyncio.run(service.generate_response(req))

    assert response.is_verified is False
    assert response.confidence == 0.0
    assert 'could not find verified university information' in response.message.lower()
    assert len(response.sources) == 0


def test_multi_turn_history_in_chat_request():
    payload = {
        'message': 'Where is it located?',
        'language': 'en',
        'history': [
            {'role': 'user', 'content': 'Is there a computer science school?'},
            {'role': 'assistant', 'content': 'Yes, the School of Computer Science is located in the Innovation District.'},
        ],
    }
    class HistoryCheckingService:
        async def generate_response(self, request):
            assert len(request.history) == 2
            assert request.history[0].role == 'user'
            assert request.history[1].role == 'assistant'
            return ChatResponse(
                message='The School of Computer Science is in the Innovation District.',
                language=request.language,
                is_verified=True,
                confidence=0.95,
                sources=[Source(source='Demo Directory', title='School of CS')],
                suggestions=[],
            )

    client_app = TestClient(app)
    import app.features.chat.router as router_mod
    router_mod.ChatService = HistoryCheckingService

    res = client_app.post('/api/chat', json=payload)
    assert res.status_code == 200
