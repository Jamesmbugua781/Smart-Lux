"""
scripts/ingest_school_data.py
CLI script to ingest school knowledge JSON documents into PostgreSQL with pgvector embeddings.

Usage:
  python -m app.scripts.ingest_school_data --file app/features/campus/data/scit_knowledge.json
"""
from __future__ import annotations

import argparse
import json
import logging
from pathlib import Path

from app.core.database import SessionLocal, Base, engine
from app.features.campus.models import SchoolKnowledge
from app.features.chat.embedding import EmbeddingService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def ingest_file(file_path: Path) -> int:
    """Ingest JSON documents into school_knowledge table."""
    if not file_path.exists():
        logger.error('File not found: %s', file_path)
        return 0

    Base.metadata.create_all(bind=engine)
    embedding_service = EmbeddingService()

    with file_path.open(encoding='utf-8') as f:
        items = json.load(f)

    db = SessionLocal()
    count = 0
    try:
        for item in items:
            school_code = item.get('school_code', 'SCIT')
            name = item.get('name', '')
            description = item.get('description', '')
            category = item.get('category', '')
            
            # Text chunk representation for vector embedding
            chunk = f"{school_code} {category} {name}: {description}"
            emb = embedding_service.generate_embedding(chunk)

            # Check if record already exists by school_code and name
            existing = (
                db.query(SchoolKnowledge)
                .filter(
                    SchoolKnowledge.school_code == school_code,
                    SchoolKnowledge.name == name,
                )
                .first()
            )

            if existing:
                existing.school_name = item.get('school_name', 'School of Computing & Information Technology')
                existing.category = category
                existing.description = description
                existing.location = item.get('location', '')
                existing.source = item.get('source', '')
                existing.keywords = item.get('keywords', [])
                existing.embedding = emb
            else:
                record = SchoolKnowledge(
                    school_code=school_code,
                    school_name=item.get('school_name', 'School of Computing & Information Technology'),
                    category=category,
                    name=name,
                    description=description,
                    location=item.get('location', ''),
                    source=item.get('source', ''),
                    keywords=item.get('keywords', []),
                    embedding=emb,
                )
                db.add(record)
            count += 1
        db.commit()
        logger.info('Successfully ingested %d school knowledge items from %s into PostgreSQL pgvector table.', count, file_path)
        return count
    except Exception as err:
        db.rollback()
        logger.error('Failed to ingest school data: %s', err)
        raise err
    finally:
        db.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Ingest school knowledge into pgvector PostgreSQL table')
    parser.add_argument('--file', type=str, required=True, help='Path to JSON file containing school knowledge')
    args = parser.parse_args()
    ingest_file(Path(args.file))
