"""
features/campus/school_router.py
API endpoints for School Knowledge Ingestion, Management, and Vector Search (pgvector).
"""
from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.features.campus.models import SchoolKnowledge
from app.features.chat.embedding import EmbeddingService
from app.features.chat.retrieval import RetrievalService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/school", tags=["School Knowledge & Vectors"])


class IngestItem(BaseModel):
    school_code: str = Field(..., example="SCIT")
    school_name: str = Field(..., example="School of Computing & Information Technology")
    category: str = Field(..., example="Facilities & Labs")
    name: str = Field(..., example="Ada Lovelace AI Lab")
    description: str = Field(..., example="High performance GPU cluster for AI coursework.")
    location: str = Field(default="", example="Ada Lovelace Hall, 3rd Floor")
    source: str = Field(default="", example="SCIT Admin")
    keywords: list[str] = Field(default_factory=list)


class IngestPayload(BaseModel):
    items: list[IngestItem]


class SchoolSearchRequest(BaseModel):
    query: str
    school_code: str = "SCIT"
    limit: int = 5


@router.get("/knowledge", response_model=list[dict[str, Any]])
def get_school_knowledge(
    school_code: str = Query("SCIT", description="School code to filter by (e.g. SCIT)"),
    db: Session = Depends(get_db),
):
    """Retrieve all knowledge entries registered for a given school."""
    records = db.query(SchoolKnowledge).filter(SchoolKnowledge.school_code == school_code.upper()).all()
    return [r.to_dict() for r in records]


@router.post("/ingest", status_code=status.HTTP_201_CREATED)
def ingest_school_knowledge(
    payload: IngestPayload,
    db: Session = Depends(get_db),
):
    """
    Ingest knowledge items for a school into the PostgreSQL database.
    Automatically generates 384-dimensional dense vector embeddings for vector search.
    """
    embedding_service = EmbeddingService()
    ingested_count = 0

    try:
        for item in payload.items:
            chunk = f"{item.school_code} {item.category} {item.name}: {item.description}"
            emb = embedding_service.generate_embedding(chunk)

            existing = (
                db.query(SchoolKnowledge)
                .filter(
                    SchoolKnowledge.school_code == item.school_code.upper(),
                    SchoolKnowledge.name == item.name,
                )
                .first()
            )

            if existing:
                existing.school_name = item.school_name
                existing.category = item.category
                existing.description = item.description
                existing.location = item.location
                existing.source = item.source
                existing.keywords = item.keywords
                existing.embedding = emb
            else:
                record = SchoolKnowledge(
                    school_code=item.school_code.upper(),
                    school_name=item.school_name,
                    category=item.category,
                    name=item.name,
                    description=item.description,
                    location=item.location,
                    source=item.source,
                    keywords=item.keywords,
                    embedding=emb,
                )
                db.add(record)
            ingested_count += 1
        db.commit()
        return {"status": "success", "ingested_items": ingested_count}
    except Exception as error:
        db.rollback()
        logger.error("Failed to ingest school knowledge: %s", error)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ingestion failed: {error}",
        )


@router.post("/search", response_model=list[dict[str, Any]])
def search_school_vectors(
    req: SchoolSearchRequest,
    db: Session = Depends(get_db),
):
    """Execute vector similarity search on school-specific knowledge."""
    retrieval_service = RetrievalService()
    results = retrieval_service.search(
        question=req.query,
        limit=req.limit,
        school_code=req.school_code,
    )
    return results
