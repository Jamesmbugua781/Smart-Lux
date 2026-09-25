from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.features.admin.schemas import CreateInstitutionRequest, DirectTextUploadRequest
from app.features.admin.service import AdminService
from app.features.campus.models import User

router = APIRouter(tags=['admin'])
logger = logging.getLogger(__name__)


def enforce_admin_role(user: User = Depends(get_current_user)) -> User:
    """Dependency: Require admin or super_admin role."""
    if user.role not in ('admin', 'super_admin'):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Access denied. Institution Admin privileges required.',
        )
    return user


@router.post('/admin/documents/upload-text')
async def upload_text_document(
    payload: DirectTextUploadRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(enforce_admin_role),
):
    """Admin endpoint to upload direct text/JSON guidelines for Smart Lux RAG retrieval."""
    service = AdminService()
    return service.process_document_upload(
        raw_content=payload.content,
        filename=payload.filename,
        file_type=payload.file_type,
        institution_id=payload.institution_id or admin.institution_id or 'dekut',
        uploaded_by=admin.full_name or admin.email,
        db=db,
    )


@router.post('/admin/documents/upload-file')
async def upload_file_document(
    file: UploadFile = File(...),
    institution_id: str = Form('dekut'),
    db: Session = Depends(get_db),
    admin: User = Depends(enforce_admin_role),
):
    """Admin endpoint to upload file documents (TXT / JSON / PDF text)."""
    try:
        content_bytes = await file.read()
        raw_content = content_bytes.decode('utf-8', errors='ignore')
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Could not read file content: {err}',
        )

    ext = file.filename.split('.')[-1].lower() if '.' in file.filename else 'txt'
    service = AdminService()
    return service.process_document_upload(
        raw_content=raw_content,
        filename=file.filename,
        file_type=ext,
        institution_id=institution_id or admin.institution_id or 'dekut',
        uploaded_by=admin.full_name or admin.email,
        db=db,
    )


@router.get('/admin/documents')
async def list_admin_documents(
    institution_id: str = 'dekut',
    db: Session = Depends(get_db),
    admin: User = Depends(enforce_admin_role),
):
    """List uploaded knowledge documents for the active institution."""
    inst_id = institution_id or admin.institution_id or 'dekut'
    return AdminService.list_documents(institution_id=inst_id, db=db)


@router.delete('/admin/documents/{document_id}')
async def delete_admin_document(
    document_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(enforce_admin_role),
):
    """Delete an uploaded knowledge document and purge its vector embeddings."""
    success = AdminService.delete_document(document_id, db)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Document not found')
    return {'message': 'Document deleted and knowledge embeddings purged'}


@router.post('/admin/institutions')
async def create_new_institution(
    payload: CreateInstitutionRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(enforce_admin_role),
):
    """Admin endpoint to add or update an institution profile."""
    return AdminService.create_institution(
        inst_id=payload.id,
        code=payload.code,
        name=payload.name,
        city=payload.city,
        description=payload.description,
        db=db,
    )
