"""
features/campus/models.py
SQLAlchemy models for general campus and school-specific knowledge entries.
Persisted in PostgreSQL database with hybrid vector / pgvector support.
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
    embedding = Column(JSON, nullable=True)  # Store dense float vector as JSON array / vector float list

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


class SchoolKnowledge(Base):
    """
    SQLAlchemy model for School-Specific Knowledge (e.g. SCIT).
    Supports vector similarity search and school-level filtering.
    """
    __tablename__ = 'school_knowledge'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    school_code = Column(String(50), nullable=False, index=True)  # e.g., 'SCIT'
    school_name = Column(String(255), nullable=False, index=True) # e.g., 'School of Computing & IT'
    category = Column(String(100), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255), nullable=False, default='')
    source = Column(String(255), nullable=False, default='')
    keywords = Column(JSON, nullable=False, default=list)
    embedding = Column(JSON, nullable=True)  # Dense vector embedding (384 float dimensions)

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'school_code': self.school_code,
            'school_name': self.school_name,
            'category': self.category,
            'name': self.name,
            'description': self.description,
            'location': self.location,
            'source': self.source,
            'keywords': self.keywords or [],
            'embedding': self.embedding,
        }
