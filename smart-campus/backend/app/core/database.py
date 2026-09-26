"""
core/database.py
================
PostgreSQL-only database connection and SQLAlchemy session management.
There is NO SQLite fallback — if the database is unreachable the server
fails immediately so the misconfiguration is obvious and no data is
silently written to the wrong store.
"""
from __future__ import annotations

import logging
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

logger = logging.getLogger(__name__)


def _create_engine():
    db_url = settings.DATABASE_URL

    if db_url.startswith('sqlite'):
        # Explicitly block SQLite — this project is PostgreSQL-only.
        logger.critical(
            'DATABASE_URL is set to SQLite (%s). This project requires PostgreSQL. '
            'Set DATABASE_URL to a valid postgresql:// connection string.',
            db_url,
        )
        sys.exit(1)

    try:
        eng = create_engine(
            db_url,
            future=True,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,   # discard stale connections before reuse
        )
        # Verify the connection is actually reachable at startup
        with eng.connect():
            pass
        logger.info('PostgreSQL connected: %s', db_url.split('@')[-1])  # host only, no credentials
        return eng
    except Exception as err:
        logger.critical(
            'Cannot connect to PostgreSQL (%s): %s\n'
            'Check that:\n'
            '  1. PostgreSQL is running\n'
            '  2. DATABASE_URL in .env is correct\n'
            '  3. The database and user exist',
            db_url.split('@')[-1],
            err,
        )
        sys.exit(1)


engine = _create_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
