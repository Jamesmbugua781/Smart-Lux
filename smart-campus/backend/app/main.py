from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import academics, announcements, campus, chat, health
from app.core.config import settings

app = FastAPI(
    title='Smart Campus Assistant API',
    version='0.1.0',
    description='Prototype backend for the Smart Campus Assistant platform.',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(health.router, prefix='/api', tags=['health'])
app.include_router(chat.router, prefix='/api', tags=['chat'])
app.include_router(campus.router, prefix='/api', tags=['campus'])
app.include_router(announcements.router, prefix='/api', tags=['announcements'])
app.include_router(academics.router, prefix='/api', tags=['academics'])


@app.get('/')
async def root():
    return {'message': 'Smart Campus Assistant API is running.'}
