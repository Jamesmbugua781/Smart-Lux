"""
tests/test_hybrid_rag.py
Tests for Hybrid RAG (Keyword + Vector similarity), Text Chunker,
Document Ingestion Pipeline, and knowledge CRUD endpoints.
"""
from __future__ import annotations

from fastapi.testclient import TestClient
from app.main import app
from app.features.campus.chunking import TextChunker
from app.features.chat.retrieval import RetrievalService
from app.features.chat.embedding import EmbeddingService, cosine_similarity

client = TestClient(app)


def test_cosine_similarity_identical_vectors():
    vec_a = [1.0, 2.0, 3.0]
    vec_b = [1.0, 2.0, 3.0]
    sim = cosine_similarity(vec_a, vec_b)
    assert round(sim, 4) == 1.0


def test_cosine_similarity_orthogonal_vectors():
    vec_a = [1.0, 0.0]
    vec_b = [0.0, 1.0]
    sim = cosine_similarity(vec_a, vec_b)
    assert sim == 0.0


def test_text_chunker_splits_long_text():
    chunker = TextChunker(chunk_size=100, chunk_overlap=20)
    long_text = (
        'The University Smart Campus provides state of the art digital services for all enrolled students. '
        'Students can access the central library, computer labs, academic registration portals, and student support services. '
        'All campus policies must be strictly followed by undergraduate and postgraduate students.'
    )
    chunks = chunker.chunk_text(long_text)
    assert len(chunks) > 1
    assert all(len(c) <= 180 for c in chunks)


def test_hybrid_search_returns_relevant_campus_info():
    service = RetrievalService()
    results = service.search('Where can I borrow books in English or Swahili?')
    names = [r['name'] for r in results]
    assert any('Library' in name for name in names)


def test_knowledge_crud_endpoints():
    payload = {
        'category': 'facilities',
        'name': 'Innovation Hub & Makerspace',
        'description': '3D printers, laser cutters, and collaborative workspace for smart campus projects.',
        'location': 'Building 4, Room 201',
        'source': 'Campus Facilities Guide',
        'keywords': ['maker', '3d printer', 'innovation', 'hub'],
    }
    response = client.post('/api/campus/knowledge', json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data['name'] == 'Innovation Hub & Makerspace'
    assert 'id' in data

    list_response = client.get('/api/campus/knowledge')
    assert list_response.status_code == 200
    items = list_response.json()
    assert any(item['name'] == 'Innovation Hub & Makerspace' for item in items)


def test_document_ingestion_pipeline_endpoint():
    doc_payload = {
        'title': 'Smart Campus Examination Regulations 2026',
        'content': (
            'All students must carry valid student identification cards into examination halls. '
            'Electronic devices including mobile phones and smart watches are strictly prohibited in exam rooms. '
            'Students arriving more than 30 minutes after exam commencement will not be admitted.'
        ),
        'category': 'regulations',
        'source': 'Registry Office',
    }
    response = client.post('/api/campus/ingest-document', json=doc_payload)
    assert response.status_code == 201
    res_data = response.json()
    assert res_data['title'] == 'Smart Campus Examination Regulations 2026'
    assert res_data['total_chunks'] >= 1
    assert len(res_data['chunk_ids']) == res_data['total_chunks']

    # Verify RAG search can retrieve from the ingested document
    retrieval_service = RetrievalService()
    search_results = retrieval_service.search('What happens if I arrive 30 minutes late to an exam?')
    assert len(search_results) > 0
    assert any('Examination Regulations' in r['name'] for r in search_results)
