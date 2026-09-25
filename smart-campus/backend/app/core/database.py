"""
core/database.py
PostgreSQL database connection and SQLAlchemy session management.
Includes automatic fallback if local PostgreSQL authentication fails or is unreachable.
"""
from __future__ import annotations

import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

logger = logging.getLogger(__name__)


def _create_robust_engine():
    db_url = settings.DATABASE_URL
    connect_args = {}
    if db_url.startswith('sqlite'):
        connect_args = {'check_same_thread': False}

    try:
        eng = create_engine(db_url, connect_args=connect_args, future=True)
        # Test connection immediately
        with eng.connect() as conn:
            pass
        return eng
    except Exception as err:
        logger.warning(
            'Primary DATABASE_URL connection (%s) failed: %s. Using local database instance.',
            db_url,
            err,
        )
        fallback_url = 'sqlite:///./smart_campus.db'
        return create_engine(fallback_url, connect_args={'check_same_thread': False}, future=True)


engine = _create_robust_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
