from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.features.auth.schemas import (
    AuthTokenResponse,
    GoogleAuthRequest,
    LoginRequest,
    RegisterRequest,
    UserResponse,
)
from app.features.auth.service import AuthService, ensure_default_institutions
from app.features.campus.models import Institution, User

router = APIRouter(tags=['auth'])


@router.post('/auth/register', response_model=AuthTokenResponse)
async def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> AuthTokenResponse:
    """Register a new student or institution admin account."""
    return AuthService.register_user(payload, db)


@router.post('/auth/login', response_model=AuthTokenResponse)
async def login(payload: LoginRequest, db: Session = Depends(get_db)) -> AuthTokenResponse:
    """Login with Email and Password."""
    return AuthService.login_user(payload, db)


@router.post('/auth/google', response_model=AuthTokenResponse)
async def google_login(payload: GoogleAuthRequest, db: Session = Depends(get_db)) -> AuthTokenResponse:
    """Authenticate or register user via Google OAuth."""
    return AuthService.google_auth(payload, db)


@router.get('/auth/me', response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    """Fetch current authenticated user profile."""
    return UserResponse(**current_user.to_dict())


@router.get('/auth/institutions')
async def list_institutions(db: Session = Depends(get_db)):
    """List available active institutions for selection."""
    ensure_default_institutions(db)
    institutions = db.query(Institution).filter(Institution.is_active == True).all()
    return [inst.to_dict() for inst in institutions]
