"""initial_schema — add institution_id to knowledge tables

Revision ID: cc30c05c572c
Revises:
Create Date: 2026-09-26 01:47:33

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers
revision: str = 'cc30c05c572c'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add institution_id column to campus_knowledge (with named FK)
    op.add_column('campus_knowledge', sa.Column('institution_id', sa.String(length=50), nullable=False, server_default='dekut'))
    op.create_index(op.f('ix_campus_knowledge_institution_id'), 'campus_knowledge', ['institution_id'], unique=False)
    op.create_foreign_key(
        'fk_campus_knowledge_institution_id',
        'campus_knowledge', 'institutions',
        ['institution_id'], ['id'],
    )

    # Add institution_id column to school_knowledge (with named FK)
    op.add_column('school_knowledge', sa.Column('institution_id', sa.String(length=50), nullable=False, server_default='dekut'))
    op.create_index(op.f('ix_school_knowledge_institution_id'), 'school_knowledge', ['institution_id'], unique=False)
    op.create_foreign_key(
        'fk_school_knowledge_institution_id',
        'school_knowledge', 'institutions',
        ['institution_id'], ['id'],
    )


def downgrade() -> None:
    op.drop_constraint('fk_school_knowledge_institution_id', 'school_knowledge', type_='foreignkey')
    op.drop_index(op.f('ix_school_knowledge_institution_id'), table_name='school_knowledge')
    op.drop_column('school_knowledge', 'institution_id')

    op.drop_constraint('fk_campus_knowledge_institution_id', 'campus_knowledge', type_='foreignkey')
    op.drop_index(op.f('ix_campus_knowledge_institution_id'), table_name='campus_knowledge')
    op.drop_column('campus_knowledge', 'institution_id')
