"""
features/chat/embedding.py
Embedding service for generating dense vectors and computing cosine similarity.
Supports Google Gemini embeddings with automatic fallback.
"""
from __future__ import annotations

import math
import logging
from typing import Sequence

import httpx
from google import genai

from app.core.config import settings

logger = logging.getLogger(__name__)


def cosine_similarity(vec_a: Sequence[float], vec_b: Sequence[float]) -> float:
    """Compute cosine similarity between two vector lists."""
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0

    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))

    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return dot_product / (norm_a * norm_b)


class EmbeddingService:
    """Generates dense vector embeddings using available AI providers or fallback math."""

    def __init__(self) -> None:
        self.provider = (settings.AI_PROVIDER or 'gemini').lower()
        self.gemini_client = (
            genai.Client(api_key=settings.effective_gemini_api_key)
            if settings.effective_gemini_api_key
            else None
        )

    def generate_embedding(self, text: str) -> list[float]:
        """Generate embedding vector for text."""
        if not text.strip():
            return [0.0] * 128

        if self.provider == 'gemini' and self.gemini_client:
            try:
                res = self.gemini_client.models.embed_content(
                    model='text-embedding-004',
                    contents=text,
                )
                if res.embeddings and res.embeddings[0].values:
                    return list(res.embeddings[0].values)
            except Exception as err:
                logger.warning('Gemini embedding API failed, using fallback embedding: %s', err)

        elif self.provider == 'grok' and settings.GROK_API_KEY:
            try:
                headers = {
                    'Authorization': f'Bearer {settings.GROK_API_KEY}',
                    'Content-Type': 'application/json',
                }
                payload = {
                    'input': text,
                    'model': 'v1',
                }
                response = httpx.post(
                    f'{settings.GROK_BASE_URL}/embeddings',
                    headers=headers,
                    json=payload,
                    timeout=10.0,
                )
                if response.status_code == 200:
                    data = response.json()
                    return list(data['data'][0]['embedding'])
            except Exception as err:
                logger.warning('Grok embedding API failed, using fallback embedding: %s', err)

        # Robust hashing fallback vector (dimension=128)
        return self._hash_embedding(text)

    @staticmethod
    def _hash_embedding(text: str, dim: int = 128) -> list[float]:
        """Deterministic text hashing vector embedding for offline/fallback matching."""
        vec = [0.0] * dim
        words = text.lower().split()
        for idx, word in enumerate(words):
            h = hash(word)
            for i in range(4):
                pos = (h + i * 31 + idx) % dim
                vec[pos] += 1.0 / (i + 1)
        norm = math.sqrt(sum(v * v for v in vec))
        if norm > 0:
            vec = [v / norm for v in vec]
        return vec
