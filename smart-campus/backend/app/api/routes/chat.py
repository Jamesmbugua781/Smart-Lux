import logging

from fastapi import APIRouter, HTTPException

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post('/chat', response_model=ChatResponse)
async def create_chat_response(payload: ChatRequest):
    try:
        return await ChatService().generate_response(payload)
    except Exception as error:
        logger.exception('Chat request failed: %s', error)
        raise HTTPException(status_code=502, detail='Unable to generate a campus assistant response.') from error
