"""
tests/test_school_retrieval.py
Unit and integration tests for school-specific pgvector retrieval.
"""
from __future__ import annotations

import pytest
from app.features.chat.retrieval import RetrievalService
from app.features.campus.models import SchoolKnowledge
from app.core.database import SessionLocal, Base, engine


@pytest.fixture(scope="module")
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    # Cleanup


def test_scit_school_retrieval(setup_db):
    service = RetrievalService()
    results = service.search("Where is the Ada Lovelace AI lab?", school_code="SCIT")
    assert len(results) > 0
    top = results[0]
    assert "Ada Lovelace" in top["name"]
    assert top["school_code"] == "SCIT"


def test_scit_capstone_query(setup_db):
    service = RetrievalService()
    results = service.search("What are the guidelines for the final year capstone project in SCIT?", school_code="SCIT")
    assert len(results) > 0
    assert any("Capstone" in item["name"] or "Project" in item["name"] for item in results)
