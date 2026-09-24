import json
import re
from pathlib import Path
from typing import Any


STOPWORDS = {
    'a', 'an', 'and', 'are', 'can', 'for', 'from', 'how', 'i', 'in', 'is',
    'it', 'of', 'on', 'or', 'the', 'there', 'this', 'to', 'what', 'where',
    'with', 'about', 'verified', 'demo',
    'iko', 'ni', 'na', 'ya', 'za', 'kwa', 'gani',
}


class RetrievalService:
    def __init__(self, knowledge_path: Path | None = None):
        path = knowledge_path or Path(__file__).parents[1] / 'data' / 'campus_knowledge.json'
        with path.open(encoding='utf-8') as knowledge_file:
            self.entries: list[dict[str, Any]] = json.load(knowledge_file)

    def search(self, question: str, limit: int = 5) -> list[dict[str, Any]]:
        terms = {
            term
            for term in re.findall(r"[\w]+", question.lower())
            if len(term) > 2 and term not in STOPWORDS
        }
        if not terms:
            return []

        ranked_entries: list[tuple[int, dict[str, Any]]] = []
        for entry in self.entries:
            searchable = ' '.join([
                entry.get('category', ''), entry.get('name', ''),
                entry.get('description', ''), entry.get('location', ''),
                ' '.join(entry.get('keywords', [])),
            ]).lower()
            score = sum(1 for term in terms if term in searchable)
            if score:
                ranked_entries.append((score, entry))
        ranked_entries.sort(key=lambda item: item[0], reverse=True)
        return [entry for _, entry in ranked_entries[:limit]]
