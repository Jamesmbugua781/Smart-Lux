from __future__ import annotations

import json
import logging
import re
from typing import Any

from sqlalchemy.orm import Session

from app.features.campus.models import CampusKnowledge, Institution, InstitutionDocument
from app.features.chat.embedding import EmbeddingService

logger = logging.getLogger(__name__)


class AdminService:
    def __init__(self, embedding_service: EmbeddingService | None = None) -> None:
        self.embedding_service = embedding_service or EmbeddingService()

    def process_document_upload(
        self,
        raw_content: str,
        filename: str,
        file_type: str,
        institution_id: str,
        uploaded_by: str,
        db: Session,
    ) -> dict[str, Any]:
        """Parse raw text/JSON document content, split into chunks, compute embeddings, and save."""
        entries_to_add: list[dict[str, Any]] = []

        if file_type == 'json':
            try:
                data = json.loads(raw_content)
                if isinstance(data, list):
                    entries_to_add = data
                elif isinstance(data, dict):
                    entries_to_add = [data]
            except Exception as err:
                logger.warning('Failed to parse JSON file content: %s', err)

        if not entries_to_add:
            # Split raw text by paragraphs or headers
            paragraphs = [p.strip() for p in re.split(r'\n\s*\n', raw_content) if len(p.strip()) > 20]
            if not paragraphs:
                paragraphs = [raw_content.strip()]

            for idx, p in enumerate(paragraphs):
                title = f"{filename} (Part {idx + 1})"
                entries_to_add.append({
                    'name': title,
                    'category': 'Institution Guideline',
                    'description': p,
                    'location': 'General Campus',
                    'source': filename,
                    'keywords': [filename, 'guideline', 'policy'],
                })

        # Save Knowledge Vector Entries
        chunks_created = 0
        for item in entries_to_add:
            chunk_text = f"{item.get('name', '')} {item.get('description', '')} {item.get('category', '')}"
            emb = self.embedding_service.generate_embedding(chunk_text)

            entry = CampusKnowledge(
                institution_id=institution_id,
                category=item.get('category', 'Document Upload'),
                name=item.get('name', filename),
                description=item.get('description', ''),
                location=item.get('location', ''),
                source=filename,
                keywords=item.get('keywords', [filename]),
                embedding=emb,
            )
            db.add(entry)
            chunks_created += 1

        # Record Document Log
        doc = InstitutionDocument(
            institution_id=institution_id,
            filename=filename,
            file_type=file_type,
            chunk_count=chunks_created,
            uploaded_by=uploaded_by,
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)

        return doc.to_dict()

    @staticmethod
    def list_documents(institution_id: str, db: Session) -> list[dict]:
        docs = db.query(InstitutionDocument).filter(InstitutionDocument.institution_id == institution_id).order_by(InstitutionDocument.created_at.desc()).all()
        return [d.to_dict() for d in docs]

    @staticmethod
    def delete_document(document_id: str, db: Session) -> bool:
        doc = db.query(InstitutionDocument).filter(InstitutionDocument.id == document_id).first()
        if not doc:
            return False
        try:
            # Purge associated campus knowledge entries for this document filename
            db.query(CampusKnowledge).filter(
                CampusKnowledge.institution_id == doc.institution_id,
                CampusKnowledge.source == doc.filename
            ).delete()
            db.query(InstitutionDocument).filter(InstitutionDocument.id == document_id).delete()
            db.commit()
            return True
        except Exception as err:
            db.rollback()
            logger.error('Failed to delete institution document %s: %s', document_id, err)
            return False

    @staticmethod
    def create_institution(
        inst_id: str,
        code: str,
        name: str,
        city: str,
        description: str,
        db: Session,
    ) -> dict:
        inst_slug = (inst_id or code).lower().replace(' ', '-')
        existing = db.query(Institution).filter(Institution.id == inst_slug).first()
        if existing:
            existing.name = name
            existing.code = code
            existing.city = city
            existing.description = description
            db.commit()
            return existing.to_dict()

        inst = Institution(
            id=inst_slug,
            code=code.upper(),
            name=name,
            city=city,
            description=description,
            is_active=True,
        )
        db.add(inst)
        db.commit()
        db.refresh(inst)
        return inst.to_dict()
