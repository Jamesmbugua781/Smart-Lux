"""
core/security.py
================
Central security utilities:
  - XSS sanitisation via bleach
  - SQL-injection guard (pattern blocker for raw string inputs)
  - Security-header middleware (X-Content-Type-Options, CSP, etc.)
"""
from __future__ import annotations

import re

import bleach
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


# ---------------------------------------------------------------------------
# XSS – sanitise any user-supplied string
# ---------------------------------------------------------------------------
_ALLOWED_TAGS: list[str] = []   # no HTML allowed in API inputs
_ALLOWED_ATTRS: dict = {}


def sanitise_string(value: str) -> str:
    """Strip all HTML/script tags from a user-supplied string."""
    cleaned = bleach.clean(value, tags=_ALLOWED_TAGS, attributes=_ALLOWED_ATTRS, strip=True)
    return html.unescape(cleaned)


# ---------------------------------------------------------------------------
# SQL-Injection guard (defence-in-depth on top of SQLAlchemy ORM)
# Matches classic injection tokens in raw input strings.
# ---------------------------------------------------------------------------
_SQL_INJECTION_PATTERN = re.compile(
    r"(--|;|'|\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION|CAST|CONVERT|DECLARE|TRUNCATE|LOAD_FILE|OUTFILE)\b)",
    re.IGNORECASE,
)


import html


def has_sql_injection(value: str) -> bool:
    """Return True if the string contains suspicious SQL fragments."""
    return bool(_SQL_INJECTION_PATTERN.search(value))


def sanitise_input(value: str) -> str:
    """Apply XSS clean + SQL-injection check, raising ValueError on threat."""
    clean = sanitise_string(value)
    # Unescape HTML entities (e.g. &amp; -> &) before SQL injection check
    unescaped = html.unescape(clean)
    if has_sql_injection(unescaped):
        raise ValueError('Input contains disallowed characters or SQL keywords.')
    return clean


# ---------------------------------------------------------------------------
# Security-Header Middleware
# Adds defensive HTTP headers to every response.
# ---------------------------------------------------------------------------
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        response: Response = await call_next(request)
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response.headers['Content-Security-Policy'] = (
            "default-src 'none'; frame-ancestors 'none';"
        )
        return response
