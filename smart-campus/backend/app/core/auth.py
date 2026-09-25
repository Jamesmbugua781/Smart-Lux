"""
core/auth.py
============
Authentication core module handling JWT generation, bcrypt password hashing,
and FastAPI dependency injection for current authenticated users.
"""
from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.features.campus.models import User

logger = logging.getLogger(__name__)

# Security Configuration
SECRET_KEY = getattr(settings, 'SECRET_KEY', 'smart-lux-super-secret-jwt-key-2026')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_DAYS = 30
security_bearer = HTTPBearer(auto_error=False)

import bcrypt

def hash_password(password: str) -> str:
    """Hash password using bcrypt (max 72 bytes)."""
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against bcrypt hash."""
    if not hashed_password or not plain_password:
        return False
    try:
        plain_bytes = plain_password.encode('utf-8')[:72]
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(plain_bytes, hash_bytes)
    except Exception as err:
        logger.warning('Bcrypt password verification failed: %s', err)
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generate JWT Access Token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
    to_encode.update({'exp': expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate JWT Access Token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError as err:
        logger.warning('Invalid JWT token: %s', err)
        return None


def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: Session = Depends(get_db),
) -> User:
    """FastAPI Dependency: Enforce authenticated user."""
    if not auth or not auth.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Authentication credentials were not provided.',
        )

    payload = decode_access_token(auth.credentials)
    if not payload or 'sub' not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid or expired authentication token.',
        )

    user_id = payload['sub']
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='User account not found.',
        )
    return user


def get_optional_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """FastAPI Dependency: Return user if authenticated, else None for Guests."""
    if not auth or not auth.credentials:
        return None

    payload = decode_access_token(auth.credentials)
    if not payload or 'sub' not in payload:
        return None

    user_id = payload['sub']
    return db.query(User).filter(User.id == user_id).first()
