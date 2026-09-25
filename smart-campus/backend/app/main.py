"""
app/main.py
===========
Application entry point using Vertical-Slice (Feature-Based) Architecture.

Each feature is self-contained under app/features/<feature>/ with its own
router, schemas, and service.  Security is applied globally:

  • CORS             – restricts origins to configured list
  • SecurityHeaders  – X-Content-Type-Options, CSP, X-Frame-Options, etc.
  • slowapi           – IP-based rate limiting (brute-force protection)
  • XSS / SQLi guard – applied at the Pydantic schema layer (see chat/schemas.py
                       and core/security.py)
"""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.core.config import settings
from app.core.security import SecurityHeadersMiddleware
from app.features.academics.router import router as academics_router
from app.features.announcements.router import router as announcements_router
from app.features.campus.router import router as campus_router
from app.features.chat.router import router as chat_router
from app.features.health.router import router as health_router

# ---------------------------------------------------------------------------
# Rate-limiter (shared instance so the chat router decorator can reference it)
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address, default_limits=[settings.RATE_LIMIT])

app = FastAPI(
    title='Smart Campus Assistant API',
    version='0.1.0',
    description='Prototype backend for the Smart Campus Assistant platform.',
)

# -- State required by slowapi --
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------
# Middleware (order matters: outermost runs first on request, last on response)
# ---------------------------------------------------------------------------
app.add_middleware(SecurityHeadersMiddleware)          # security headers on every response
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# ---------------------------------------------------------------------------
# Feature routers – all under /api prefix
# ---------------------------------------------------------------------------
app.include_router(health_router,        prefix='/api')
app.include_router(chat_router,          prefix='/api')
app.include_router(campus_router,        prefix='/api')
app.include_router(announcements_router, prefix='/api')
app.include_router(academics_router,     prefix='/api')


@app.get('/')
async def root() -> dict[str, str]:
    return {'message': 'Smart Campus Assistant API is running.'}
