from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    full_name: str = Field(default='', max_length=100)
    institution_id: str = Field(default='dekut', max_length=50)
    role: str = Field(default='student', max_length=50)  # 'student' or 'admin'


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class GoogleAuthRequest(BaseModel):
    token: str
    email: EmailStr
    full_name: str = Field(default='', max_length=100)
    avatar_url: str = Field(default='', max_length=500)
    institution_id: str = Field(default='dekut', max_length=50)


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    avatar_url: str
    role: str
    auth_provider: str
    institution_id: str


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserResponse
