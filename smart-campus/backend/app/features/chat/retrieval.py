"""
features/chat/retrieval.py
Hybrid Retrieval Service combining Sparse Keyword Search + Dense Vector Search (RRF).
Persists knowledge items in PostgreSQL database with auto-seeding from JSON.
Supports school-specific pgvector filtering (e.g. SCIT).
"""
from __future__ import annotations

import json
import logging
import re
from pathlib import Path
from typing import Any

from sqlalchemy.orm import Session

from app.core.database import SessionLocal, Base, engine
from app.features.campus.models import CampusKnowledge, SchoolKnowledge
from app.features.chat.embedding import EmbeddingService, cosine_similarity

logger = logging.getLogger(__name__)

STOPWORDS = {
    'a', 'an', 'and', 'are', 'can', 'for', 'from', 'how', 'i', 'in', 'is',
    'it', 'of', 'on', 'or', 'the', 'there', 'this', 'to', 'what', 'where',
    'with', 'about', 'verified', 'demo',
    # Kiswahili stopwords
    'iko', 'ni', 'na', 'ya', 'za', 'kwa', 'gani',
}

_DEFAULT_KNOWLEDGE_PATH = (
    Path(__file__).parents[2] / 'features' / 'campus' / 'data' / 'campus_knowledge.json'
)

_SCIT_KNOWLEDGE_PATH = (
    Path(__file__).parents[2] / 'features' / 'campus' / 'data' / 'scit_knowledge.json'
)


class RetrievalService:
    """Hybrid Retrieval Service combining Keyword matching and Vector embeddings (RRF)."""

    def __init__(
        self,
        knowledge_path: Path | None = None,
        db: Session | None = None,
        embedding_service: EmbeddingService | None = None,
    ) -> None:
        self.knowledge_path = knowledge_path or _DEFAULT_KNOWLEDGE_PATH
        self.scit_knowledge_path = _SCIT_KNOWLEDGE_PATH
        self.embedding_service = embedding_service or EmbeddingService()
        self._ensure_db_seeded(db)

    def _ensure_db_seeded(self, db: Session | None = None) -> None:
        """Create tables and seed initial database knowledge if empty."""
        try:
            Base.metadata.create_all(bind=engine)
        except Exception as err:
            logger.warning('Table creation warning: %s', err)

        close_session = False
        if db is None:
            db = SessionLocal()
            close_session = True

        try:
            # Seed General Campus Knowledge
            count_campus = db.query(CampusKnowledge).count()
            if count_campus == 0 and self.knowledge_path.exists():
                logger.info('Seeding campus_knowledge table from %s...', self.knowledge_path)
                with self.knowledge_path.open(encoding='utf-8') as f:
                    entries = json.load(f)

                for item in entries:
                    text_for_embedding = f"{item.get('name', '')} {item.get('description', '')} {item.get('category', '')}"
                    emb = self.embedding_service.generate_embedding(text_for_embedding)

                    db_entry = CampusKnowledge(
                        category=item.get('category', ''),
                        name=item.get('name', ''),
                        description=item.get('description', ''),
                        location=item.get('location', ''),
                        source=item.get('source', ''),
                        keywords=item.get('keywords', []),
                        embedding=emb,
                    )
                    db.add(db_entry)

            # Seed School Knowledge (SCIT)
            count_school = db.query(SchoolKnowledge).count()
            if count_school == 0 and self.scit_knowledge_path.exists():
                logger.info('Seeding school_knowledge (SCIT) table from %s...', self.scit_knowledge_path)
                with self.scit_knowledge_path.open(encoding='utf-8') as f:
                    scit_entries = json.load(f)

                for item in scit_entries:
                    school_code = item.get('school_code', 'SCIT')
                    chunk = f"{school_code} {item.get('category', '')} {item.get('name', '')}: {item.get('description', '')}"
                    emb = self.embedding_service.generate_embedding(chunk)

                    school_entry = SchoolKnowledge(
                        school_code=school_code,
                        school_name=item.get('school_name', 'School of Computing & Information Technology'),
                        category=item.get('category', ''),
                        name=item.get('name', ''),
                        description=item.get('description', ''),
                        location=item.get('location', ''),
                        source=item.get('source', ''),
                        keywords=item.get('keywords', []),
                        embedding=emb,
                    )
                    db.add(school_entry)

            db.commit()
        except Exception as error:
            db.rollback()
            logger.error('Failed to seed knowledge database: %s', error)
        finally:
            if close_session:
                db.close()

    def get_all_entries(self, school_code: str | None = None, db: Session | None = None) -> list[dict[str, Any]]:
        """Fetch all entries from general and school-specific databases."""
        close_session = False
        if db is None:
            db = SessionLocal()
            close_session = True

        combined_entries: list[dict[str, Any]] = []

        try:
            campus_records = db.query(CampusKnowledge).all()
            combined_entries.extend([r.to_dict() for r in campus_records])

            if school_code:
                school_records = db.query(SchoolKnowledge).filter(SchoolKnowledge.school_code == school_code.upper()).all()
            else:
                school_records = db.query(SchoolKnowledge).all()
            
            combined_entries.extend([r.to_dict() for r in school_records])

            if combined_entries:
                return combined_entries
        except Exception as err:
            logger.warning('DB query failed, falling back to JSON files: %s', err)
        finally:
            if close_session:
                db.close()

        # Fallback to local JSON files if DB is unreachable
        if self.knowledge_path.exists():
            with self.knowledge_path.open(encoding='utf-8') as f:
                combined_entries.extend(json.load(f))
        if self.scit_knowledge_path.exists():
            with self.scit_knowledge_path.open(encoding='utf-8') as f:
                combined_entries.extend(json.load(f))

        return combined_entries

    def search(self, question: str, limit: int = 5, alpha: float = 0.5, school_code: str | None = None) -> list[dict[str, Any]]:
        """
        Execute Hybrid Search (Keyword + Vector Similarity) with thresholding.
        Returns empty list if no relevant knowledge entries match.
        """
        # Detect if query explicitly asks about SCIT / Computing
        lower_q = question.lower()
        if not school_code and any(k in lower_q for k in ['scit', 'computing', 'computer science', 'software engineering', 'ai lab', 'ada lovelace', 'turing', 'cisco lab', 'capstone']):
            school_code = 'SCIT'

        entries = self.get_all_entries(school_code=school_code)
        if not entries:
            return []

        # 1. Sparse Keyword Ranking
        terms = {
            term
            for term in re.findall(r'[\w]+', question.lower())
            if len(term) > 2 and term not in STOPWORDS
        }

        if not terms:
            return []

        # 2. Dense Vector Ranking
        query_emb = self.embedding_service.generate_embedding(question)

        scored_entries: list[tuple[float, float, float, dict[str, Any]]] = []
        max_kw_score = 0.0
        max_vec_score = 0.0

        for entry in entries:
            searchable = ' '.join([
                entry.get('school_code', ''), entry.get('school_name', ''),
                entry.get('category', ''), entry.get('name', ''),
                entry.get('description', ''), entry.get('location', ''),
                ' '.join(entry.get('keywords', [])),
            ]).lower()

            # Count keyword hits
            kw_score = float(sum(1 for term in terms if term in searchable))
            if kw_score > max_kw_score:
                max_kw_score = kw_score

            # Vector similarity
            doc_emb = entry.get('embedding')
            if not doc_emb:
                text = f"{entry.get('school_code', '')} {entry.get('name', '')} {entry.get('description', '')} {entry.get('category', '')}"
                doc_emb = self.embedding_service.generate_embedding(text)

            vec_score = cosine_similarity(query_emb, doc_emb)
            if vec_score > max_vec_score:
                max_vec_score = vec_score

            # Boost school-specific matches if relevant to query
            boost = 1.0
            if entry.get('school_code') and school_code and entry.get('school_code') == school_code:
                boost = 1.25

            # Combined weighted score (Keyword hits given high priority)
            combined = ((kw_score * 2.0) + (vec_score * 0.8)) * boost
            scored_entries.append((combined, kw_score, vec_score, entry))

        # Thresholding: If no keywords matched and vector score is low/unfocused, return empty
        if max_kw_score == 0 and max_vec_score < 0.45:
            return []

        # Sort descending by combined score
        scored_entries.sort(key=lambda x: x[0], reverse=True)

        # Filter out items with 0 keyword match if other entries have keyword matches
        results = []
        for combined, kw, vec, entry in scored_entries:
            if max_kw_score > 0 and kw == 0 and vec < 0.40:
                continue
            results.append(entry)

        return results[:limit]
