"""
features/campus/ingestion.py
Document Ingestion Pipeline for uploading, chunking, embedding, and indexing
campus policy documents, handbooks, and guides into PostgreSQL.
"""
from __future__ import annotations

import logging
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, Base, engine
from app.features.campus.chunking import TextChunker
from app.features.campus.models import CampusKnowledge
from app.features.chat.embedding import EmbeddingService

logger = logging.getLogger(__name__)


class DocumentIngestionService:
    """Handles parsing, chunking, embedding, and storing long documents into PostgreSQL."""

    def __init__(
        self,
        chunk_size: int = 500,
        chunk_overlap: int = 50,
        embedding_service: EmbeddingService | None = None,
    ) -> None:
        self.chunker = TextChunker(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        self.embedding_service = embedding_service or EmbeddingService()

    def ingest_document(
        self,
        title: str,
        content: str,
        category: str = 'documents',
        source: str = 'Uploaded Document',
        location: str = 'Campus Directory',
        db: Session | None = None,
    ) -> list[int]:
        """Process document content: chunk -> embed -> save chunks to PostgreSQL."""
        chunks = self.chunker.chunk_text(content)
        if not chunks:
            return []

        Base.metadata.create_all(bind=engine)
        close_session = False
        if db is None:
            db = SessionLocal()
            close_session = True

        created_ids: list[int] = []
        try:
            for idx, chunk in enumerate(chunks, start=1):
                chunk_name = f"{title} (Part {idx}/{len(chunks)})" if len(chunks) > 1 else title
                embedding = self.embedding_service.generate_embedding(f"{title} {chunk}")

                db_item = CampusKnowledge(
                    category=category,
                    name=chunk_name,
                    description=chunk,
                    location=location,
                    source=source,
                    keywords=[title.lower(), category.lower(), 'document', f'chunk-{idx}'],
                    embedding=embedding,
                )
                db.add(db_item)
                db.flush()
                created_ids.append(db_item.id)

            db.commit()
            logger.info('Successfully ingested document "%s" into %d chunks.', title, len(chunks))
            return created_ids
        except Exception as error:
            db.rollback()
            logger.error('Failed to ingest document "%s": %s', title, error)
            raise error
        finally:
            if close_session:
                db.close()
