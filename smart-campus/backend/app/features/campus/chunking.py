"""
features/campus/chunking.py
Text chunking module for splitting long campus documents, policy handbooks,
and text files into overlapping passages for optimal vector RAG retrieval.
"""
from __future__ import annotations

import re


class TextChunker:
    """Splits long text into overlapping chunks optimized for embedding & search."""

    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50) -> None:
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_text(self, text: str) -> list[str]:
        """Split text into overlapping passages, preserving sentence boundaries where possible."""
        cleaned_text = re.sub(r'\s+', ' ', text).strip()
        if not cleaned_text:
            return []

        if len(cleaned_text) <= self.chunk_size:
            return [cleaned_text]

        sentences = re.split(r'(?<=[.!?])\s+', cleaned_text)
        chunks: list[str] = []
        current_chunk: list[str] = []
        current_length = 0

        for sentence in sentences:
            sentence_len = len(sentence)
            if current_length + sentence_len > self.chunk_size and current_chunk:
                chunk_str = ' '.join(current_chunk)
                chunks.append(chunk_str)

                # Maintain overlap from trailing sentences
                overlap_len = 0
                overlap_sentences: list[str] = []
                for prev in reversed(current_chunk):
                    if overlap_len + len(prev) <= self.chunk_overlap:
                        overlap_sentences.insert(0, prev)
                        overlap_len += len(prev)
                    else:
                        break
                current_chunk = overlap_sentences
                current_length = sum(len(s) for s in current_chunk)

            current_chunk.append(sentence)
            current_length += sentence_len

        if current_chunk:
            chunks.append(' '.join(current_chunk))

        return chunks
