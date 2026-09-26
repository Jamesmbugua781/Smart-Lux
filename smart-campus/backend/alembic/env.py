"""
alembic/env.py
==============
Alembic migration environment.
Reads DATABASE_URL from app settings and auto-detects all SQLAlchemy models
so that `alembic revision --autogenerate` produces accurate diffs.
"""
from __future__ import annotations

from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# ---------------------------------------------------------------------------
# Import application models so Alembic can see metadata
# ---------------------------------------------------------------------------
# This import triggers all SQLAlchemy model definitions to register with Base.
import app.features.campus.models  # noqa: F401 – side-effect import
from app.core.database import Base
from app.core.config import settings

# Alembic Config object (gives access to values in alembic.ini)
config = context.config

# Override sqlalchemy.url with the value from our settings (respects .env)
config.set_main_option('sqlalchemy.url', settings.DATABASE_URL)

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# MetaData object for 'autogenerate' support
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (no live DB connection needed)."""
    url = config.get_main_option('sqlalchemy.url')
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={'paramstyle': 'named'},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode (live DB connection)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
