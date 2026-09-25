from fastapi import APIRouter, HTTPException

from app.features.campus.ingestion import DocumentIngestionService
from app.features.campus.schemas import (
    CampusLocationResponse,
    DocumentIngestRequest,
    DocumentIngestResponse,
    KnowledgeItemCreate,
    KnowledgeItemResponse,
)
from app.features.campus.service import CampusService

router = APIRouter(tags=['campus'])


@router.get('/campus', response_model=list[CampusLocationResponse])
async def list_campus_locations() -> list[CampusLocationResponse]:
    return CampusService.get_locations()


@router.get('/campus/locations/{location_id}', response_model=CampusLocationResponse)
async def get_campus_location(location_id: str) -> CampusLocationResponse:
    location = CampusService.get_location(location_id)
    if not location:
        raise HTTPException(status_code=404, detail='Campus location not found.')
    return location


@router.get('/campus/knowledge', response_model=list[KnowledgeItemResponse])
async def list_knowledge_items() -> list[KnowledgeItemResponse]:
    return CampusService.list_knowledge_items()


@router.post('/campus/knowledge', response_model=KnowledgeItemResponse, status_code=201)
async def create_knowledge_item(payload: KnowledgeItemCreate) -> KnowledgeItemResponse:
    try:
        return CampusService.add_knowledge_item(payload)
    except Exception as err:
        raise HTTPException(status_code=500, detail=f'Failed to add knowledge item: {err}') from err


@router.post('/campus/ingest-document', response_model=DocumentIngestResponse, status_code=201)
async def ingest_document(payload: DocumentIngestRequest) -> DocumentIngestResponse:
    """Ingest long text/policy document: auto-chunks, computes embeddings, and stores in PostgreSQL."""
    try:
        service = DocumentIngestionService()
        chunk_ids = service.ingest_document(
            title=payload.title,
            content=payload.content,
            category=payload.category,
            source=payload.source,
        )
        return DocumentIngestResponse(
            message='Document ingested, chunked, and indexed successfully.',
            title=payload.title,
            total_chunks=len(chunk_ids),
            chunk_ids=chunk_ids,
        )
    except Exception as err:
        raise HTTPException(status_code=500, detail=f'Document ingestion failed: {err}') from err
