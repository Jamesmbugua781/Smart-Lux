"""
features/campus/models.py
SQLAlchemy model for campus knowledge entries.
Persisted in PostgreSQL database.
"""
from __future__ import annotations

from sqlalchemy import Column, Integer, String, Text, JSON
from app.core.database import Base


class CampusKnowledge(Base):
    __tablename__ = 'campus_knowledge'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category = Column(String(100), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255), nullable=False, default='')
    source = Column(String(255), nullable=False, default='')
    keywords = Column(JSON, nullable=False, default=list)
    embedding = Column(JSON, nullable=True)  # Store dense float vector as JSON array

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'category': self.category,
            'name': self.name,
            'description': self.description,
            'location': self.location,
            'source': self.source,
            'keywords': self.keywords or [],
            'embedding': self.embedding,
        }
