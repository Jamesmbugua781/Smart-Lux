"""
features/campus/service.py
Service for campus locations and knowledge base management in PostgreSQL.
"""
from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.features.campus.models import CampusKnowledge
from app.features.campus.schemas import CampusLocationResponse, KnowledgeItemCreate, KnowledgeItemResponse
from app.features.chat.embedding import EmbeddingService


class CampusService:
    @staticmethod
    def get_locations() -> list[CampusLocationResponse]:
        return [
            CampusLocationResponse(
                id='library',
                name='Central Library',
                category='Academic Hub',
                description='Campus library for research support and study access.',
                badge='Library',
                area='North Quadrant',
                location_type='library',
                coordinates={'lat': -0.3976875, 'lng': 36.9611875},
                external_url='https://www.dkut.ac.ke/library/#gsc.tab=0',
            ),
            CampusLocationResponse(
                id='computer-science',
                name='School of Computer Science',
                category='Academic Department',
                description='Department location for computing and digital studies.',
                badge='School',
                area='Innovation District',
                location_type='school',
                coordinates={'lat': -0.3975375, 'lng': 36.9610156},
                building_id='admin-academic-block',
                external_url='https://csit.dkut.ac.ke/',
            ),
            CampusLocationResponse(
                id='student-center',
                name='Student Services Center',
                category='Support Office',
                description='Student support services and general assistance point.',
                badge='Support',
                area='Main Campus',
                location_type='support',
                coordinates={'lat': -0.3927875, 'lng': 36.9590469},
                external_url='https://studentwelfare.dkut.ac.ke/',
            ),
            CampusLocationResponse(
                id='registry',
                name='Registry Office',
                category='Administration',
                description='Office for records, admission, and student administration.',
                badge='Registry',
                area='Administration Block',
                location_type='registry',
                coordinates={'lat': -0.3975375, 'lng': 36.9610156},
                building_id='admin-academic-block',
                external_url='https://www.dkut.ac.ke/index.php/admissions-and-records',
            ),
            CampusLocationResponse(
                id='ict',
                name='ICT Help Desk',
                category='Technology',
                description='Digital access assistance and campus connectivity support.',
                badge='ICT',
                area='Tech Plaza',
                location_type='ict',
                coordinates={'lat': -0.3975375, 'lng': 36.9610156},
                building_id='admin-academic-block',
                external_url='https://helpdesk.dkut.ac.ke/',
            ),
            CampusLocationResponse(
                id='engineering',
                name='Engineering Faculty',
                category='Academic Department',
                description='Faculty building for engineering and applied sciences.',
                badge='Faculty',
                area='Science Campus',
                location_type='school',
                coordinates={'lat': -0.3988625, 'lng': 36.9628281},
                external_url='https://soe.dkut.ac.ke/',
            ),
        ]

    @staticmethod
    def get_location(location_id: str) -> CampusLocationResponse | None:
        for location in CampusService.get_locations():
            if location.id == location_id:
                return location
        return None

    @staticmethod
    def add_knowledge_item(payload: KnowledgeItemCreate, db: Session | None = None) -> KnowledgeItemResponse:
        """Add a new campus knowledge item, auto-generating its vector embedding."""
        close_session = False
        if db is None:
            db = SessionLocal()
            close_session = True

        try:
            embedding_service = EmbeddingService()
            text_for_embedding = f"{payload.name} {payload.description} {payload.category}"
            emb = embedding_service.generate_embedding(text_for_embedding)

            item = CampusKnowledge(
                category=payload.category,
                name=payload.name,
                description=payload.description,
                location=payload.location,
                source=payload.source,
                keywords=payload.keywords,
                embedding=emb,
            )
            db.add(item)
            db.commit()
            db.refresh(item)
            return KnowledgeItemResponse(
                id=item.id,
                category=item.category,
                name=item.name,
                description=item.description,
                location=item.location,
                source=item.source,
                keywords=item.keywords or [],
            )
        finally:
            if close_session:
                db.close()

    @staticmethod
    def list_knowledge_items(db: Session | None = None) -> list[KnowledgeItemResponse]:
        """List all campus knowledge items stored in the database."""
        close_session = False
        if db is None:
            db = SessionLocal()
            close_session = True

        try:
            records = db.query(CampusKnowledge).all()
            return [
                KnowledgeItemResponse(
                    id=rec.id,
                    category=rec.category,
                    name=rec.name,
                    description=rec.description,
                    location=rec.location,
                    source=rec.source,
                    keywords=rec.keywords or [],
                )
                for rec in records
            ]
        finally:
            if close_session:
                db.close()
