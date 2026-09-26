import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, JSON, Boolean, DateTime, ForeignKey
from app.core.database import Base


class Institution(Base):
    __tablename__ = 'institutions'

    id = Column(String(50), primary_key=True, index=True)  # e.g., 'dekut', 'tum', 'uon'
    code = Column(String(50), nullable=False, unique=True, index=True) # e.g. 'DEKUT'
    name = Column(String(255), nullable=False)                         # e.g. 'Dedan Kimathi University of Technology'
    description = Column(Text, nullable=False, default='')
    city = Column(String(100), nullable=False, default='')
    logo_url = Column(String(500), nullable=False, default='')
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'code': self.code,
            'name': self.name,
            'description': self.description,
            'city': self.city,
            'logo_url': self.logo_url,
            'is_active': self.is_active,
        }


class User(Base):
    __tablename__ = 'users'

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=False, default='')
    avatar_url = Column(String(500), nullable=False, default='')
    role = Column(String(50), nullable=False, default='student')  # 'student' | 'admin' | 'super_admin'
    auth_provider = Column(String(50), nullable=False, default='email')  # 'email' | 'google'
    institution_id = Column(String(50), ForeignKey('institutions.id'), nullable=True, default='dekut')
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'avatar_url': self.avatar_url,
            'role': self.role,
            'auth_provider': self.auth_provider,
            'institution_id': self.institution_id or 'dekut',
        }


class CampusKnowledge(Base):
    __tablename__ = 'campus_knowledge'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    institution_id = Column(String(50), ForeignKey('institutions.id'), nullable=False, default='dekut', index=True)
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
            'institution_id': self.institution_id,
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
    institution_id = Column(String(50), ForeignKey('institutions.id'), nullable=False, default='dekut', index=True)
    school_code = Column(String(50), nullable=False, index=True)  # e.g., 'SCIT'
    school_name = Column(String(255), nullable=False, index=True) # e.g., 'School of Computing & IT'
    category = Column(String(100), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255), nullable=False, default='')
    source = Column(String(255), nullable=False, default='')
    keywords = Column(JSON, nullable=False, default=list)
    embedding = Column(JSON, nullable=True)  # Dense vector embedding

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'institution_id': self.institution_id,
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

class ChatSession(Base):
    __tablename__ = 'chat_sessions'

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(50), ForeignKey('users.id'), nullable=True, index=True)
    institution_id = Column(String(50), ForeignKey('institutions.id'), nullable=False, default='dekut', index=True)
    title = Column(String(255), nullable=False, default='New Conversation')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'user_id': self.user_id,
            'institution_id': self.institution_id,
            'title': self.title,
            'created_at': self.created_at.isoformat() if self.created_at else '',
            'updated_at': self.updated_at.isoformat() if self.updated_at else '',
        }


class ChatMessageRecord(Base):
    __tablename__ = 'chat_messages'

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(50), ForeignKey('chat_sessions.id'), nullable=False, index=True)
    role = Column(String(20), nullable=False, default='user')  # 'user' | 'assistant'
    content = Column(Text, nullable=False, default='')
    sources = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'session_id': self.session_id,
            'role': self.role,
            'text': self.content,
            'sources': self.sources or [],
            'timestamp': self.created_at.strftime('%H:%M') if self.created_at else '',
        }


class InstitutionDocument(Base):
    __tablename__ = 'institution_documents'

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    institution_id = Column(String(50), ForeignKey('institutions.id'), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False, default='txt')  # 'txt' | 'pdf' | 'json'
    chunk_count = Column(Integer, nullable=False, default=1)
    uploaded_by = Column(String(255), nullable=False, default='Admin')
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'institution_id': self.institution_id,
            'filename': self.filename,
            'file_type': self.file_type,
            'chunk_count': self.chunk_count,
            'uploaded_by': self.uploaded_by,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else '',
        }



