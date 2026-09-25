from __future__ import annotations

import logging
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import create_access_token, hash_password, verify_password
from app.features.auth.schemas import (
    AuthTokenResponse,
    GoogleAuthRequest,
    LoginRequest,
    RegisterRequest,
    UserResponse,
)
from app.features.campus.models import Institution, User

logger = logging.getLogger(__name__)

# Default institutions seed list
DEFAULT_INSTITUTIONS = [
    {
        'id': 'dekut',
        'code': 'DEKUT',
        'name': 'Dedan Kimathi University of Technology',
        'city': 'Nyeri',
        'description': 'Leading university of technology in Kenya known for engineering, IT, and innovation.',
    },
    {
        'id': 'tum',
        'code': 'TUM',
        'name': 'Technical University of Mombasa',
        'city': 'Mombasa',
        'description': 'Premier coastal technical university specializing in engineering, maritime studies, and computing.',
    },
    {
        'id': 'uon',
        'code': 'UON',
        'name': 'University of Nairobi',
        'city': 'Nairobi',
        'description': 'Pioneer university in Kenya offering world-class academic programs across diverse faculties.',
    },
    {
        'id': 'strathmore',
        'code': 'SU',
        'name': 'Strathmore University',
        'city': 'Nairobi',
        'description': 'Leading private university specializing in business, IT, law, and corporate leadership.',
    },
]


def ensure_default_institutions(db: Session) -> None:
    """Ensure default institutions exist in database."""
    try:
        if db.query(Institution).first() is None:
            for inst in DEFAULT_INSTITUTIONS:
                db_inst = Institution(
                    id=inst['id'],
                    code=inst['code'],
                    name=inst['name'],
                    city=inst['city'],
                    description=inst['description'],
                    is_active=True,
                )
                db.add(db_inst)
            db.commit()
    except Exception as err:
        db.rollback()
        logger.warning('Failed to seed default institutions: %s', err)


class AuthService:
    @staticmethod
    def register_user(req: RegisterRequest, db: Session) -> AuthTokenResponse:
        ensure_default_institutions(db)

        # Check existing user
        existing_user = db.query(User).filter(User.email == req.email.lower()).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='An account with this email address already exists.',
            )

        # Verify institution ID exists or fallback to dekut
        inst = db.query(Institution).filter(Institution.id == req.institution_id).first()
        inst_id = inst.id if inst else 'dekut'

        hashed = hash_password(req.password)
        user = User(
            email=req.email.lower(),
            password_hash=hashed,
            full_name=req.full_name or req.email.split('@')[0].capitalize(),
            role=req.role if req.role in ('admin', 'super_admin') else 'student',
            auth_provider='email',
            institution_id=inst_id,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_access_token({'sub': user.id, 'email': user.email, 'role': user.role})
        return AuthTokenResponse(
            access_token=token,
            user=UserResponse(**user.to_dict()),
        )

    @staticmethod
    def login_user(req: LoginRequest, db: Session) -> AuthTokenResponse:
        user = db.query(User).filter(User.email == req.email.lower()).first()
        if not user or not user.password_hash or not verify_password(req.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Invalid email or password.',
            )

        token = create_access_token({'sub': user.id, 'email': user.email, 'role': user.role})
        return AuthTokenResponse(
            access_token=token,
            user=UserResponse(**user.to_dict()),
        )

    @staticmethod
    def google_auth(req: GoogleAuthRequest, db: Session) -> AuthTokenResponse:
        ensure_default_institutions(db)
        email = req.email.lower()

        user = db.query(User).filter(User.email == email).first()
        if not user:
            # Create user on first 1-click Google Sign-In
            inst = db.query(Institution).filter(Institution.id == req.institution_id).first()
            user = User(
                email=email,
                full_name=req.full_name or email.split('@')[0].capitalize(),
                avatar_url=req.avatar_url,
                auth_provider='google',
                role='student',
                institution_id=inst.id if inst else 'dekut',
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Update profile info if missing
            if req.full_name and not user.full_name:
                user.full_name = req.full_name
            if req.avatar_url and not user.avatar_url:
                user.avatar_url = req.avatar_url
            db.commit()

        token = create_access_token({'sub': user.id, 'email': user.email, 'role': user.role})
        return AuthTokenResponse(
            access_token=token,
            user=UserResponse(**user.to_dict()),
        )
