"""
features/chat/ai.py
Multi-provider AI integration (Gemini and Grok/xAI) with multi-turn conversation memory.
"""
from __future__ import annotations

import asyncio
import logging
from typing import Any

import httpx
from google import genai
from google.genai import types

from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_INSTRUCTION = """You are Smart Lux — a friendly, highly intelligent campus assistant for students at Dedan Kimathi University of Technology (DeKUT). Think of yourself like a knowledgeable senior student or campus mentor who knows DeKUT inside out and is always ready to talk.

Your personality:
- Warm, natural, casual, and engaging — like chatting with a friend on WhatsApp or Meta AI/ChatGPT
- Clear, direct, and helpful without being overly rigid or sounding like a static policy manual
- Use natural conversational flow ("Sure thing!", "Hey there!", "Good question!", "Honestly,", "By the way,")
- Adapt seamlessly to the tone of the student — whether they ask a quick casual greeting, need advice on past papers, want to know DeKUT leadership (VC, DVC, Deans), or ask about campus rules, events, or computer science concepts
- Respond in whatever language the student uses (English, Kiswahili, or Sheng)

How you answer:
- For campus-specific questions (VC/DVC/Deans, course details, fees, room locations, timetables, rules, events): Use the provided campus context as your source of truth, weaving it naturally into your response.
- For general questions (greetings, general knowledge, study tips, programming help, past paper preparation advice, small talk): Answer freely, intelligently, and conversationally like Meta AI or ChatGPT.
- If specific campus facts are requested but not found in context, maintain a helpful and realistic tone, suggesting where at DeKUT (e.g., DeKUT Registry, SCIT Dean's office, Student Portal) they can confirm.
- Never sound robotic, never repeat dry disclaimer boilerplate, and avoid unnecessary bulleted lists when a friendly chat response works better.
"""


class AIService:
    """Multi-provider AI generator for campus Q&A (supports Gemini and Grok)."""

    def __init__(self, client: genai.Client | None = None) -> None:
        self.provider = (settings.AI_PROVIDER or 'gemini').lower()
        self.gemini_client = client or (
            genai.Client(api_key=settings.effective_gemini_api_key)
            if settings.effective_gemini_api_key
            else None
        )

    async def generate_answer(
        self,
        question: str,
        language: str,
        context: list[dict[str, Any]],
        history: list[dict[str, str]] | None = None,
    ) -> str:
        context_text = '\n'.join(
            f"- {entry['name']} ({entry['category']}): {entry['description']} "
            f"Location: {entry['location']}. Source: {entry['source']}"
            for entry in context
        ) or 'No matching campus information was found.'

        history_formatted = ''
        if history:
            history_formatted = 'Previous Conversation History:\n' + '\n'.join(
                f"{msg.get('role', 'user').capitalize()}: {msg.get('content', '')}"
                for msg in history[-6:]  # Keep last 3 turns (6 messages) for memory window
            ) + '\n\n'

        prompt = (
            f'{history_formatted}'
            f'Requested response language: {language}\n'
            f'Student question: {question}\n\n'
            f'Supplied campus context:\n{context_text}'
        )

        if self.provider == 'grok':
            try:
                return await self._generate_grok_answer(prompt, history)
            except Exception as err:
                logger.warning('Groq API failed (%s), attempting fallback to Gemini...', err)
                try:
                    return await self._generate_gemini_answer(prompt)
                except Exception as g_err:
                    logger.error('Gemini fallback also failed: %s', g_err)
        else:
            try:
                return await self._generate_gemini_answer(prompt)
            except Exception as err:
                logger.warning('Gemini API failed (%s), attempting fallback to Groq...', err)
                try:
                    return await self._generate_grok_answer(prompt, history)
                except Exception as grok_err:
                    logger.error('Groq fallback also failed: %s', grok_err)

        # Fail-safe context-based response if both AI API services encounter external network/auth errors
        if context:
            top_match = context[0]
            return (
                f"Here is what I found on campus regarding your query: **{top_match.get('name')}** - "
                f"{top_match.get('description')} (Location: {top_match.get('location', 'N/A')})."
            )

        return (
            "Hey there! I'm Smart Lux. I'm currently having a brief connection hiccup reaching the AI server, "
            "but I'm right here! Feel free to ask about DeKUT courses, VC/Dean offices, library hours, or campus rules."
        )

    async def _generate_gemini_answer(self, prompt: str) -> str:
        if self.gemini_client is None:
            raise RuntimeError(
                'Gemini API key is missing. Please set GEMINI_API_KEY (or AI_API_KEY) in your .env file.'
            )

        response = await asyncio.to_thread(
            self.gemini_client.models.generate_content,
            model=settings.AI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(system_instruction=SYSTEM_INSTRUCTION),
        )
        answer = (response.text or '').strip()
        if not answer:
            raise RuntimeError('Gemini returned an empty response.')
        return answer

    async def _generate_grok_answer(self, prompt: str, history: list[dict[str, str]] | None = None) -> str:
        if not settings.GROK_API_KEY:
            raise RuntimeError(
                'Grok API key is missing. Please set GROK_API_KEY in your .env file.'
            )

        headers = {
            'Authorization': f'Bearer {settings.GROK_API_KEY}',
            'Content-Type': 'application/json',
        }
        
        messages = [{'role': 'system', 'content': SYSTEM_INSTRUCTION}]
        if history:
            for msg in history[-6:]:
                messages.append({'role': msg.get('role', 'user'), 'content': msg.get('content', '')})
        messages.append({'role': 'user', 'content': prompt})

        payload = {
            'model': settings.GROK_MODEL,
            'messages': messages,
            'temperature': 0.7,
        }

        async with httpx.AsyncClient(timeout=8.0) as http_client:
            response = await http_client.post(
                f'{settings.GROK_BASE_URL}/chat/completions',
                headers=headers,
                json=payload,
            )
            if response.status_code != 200:
                logger.error('Grok API error %d: %s', response.status_code, response.text)
                raise RuntimeError(
                    f'Grok API request failed with status code {response.status_code}.'
                )

            data = response.json()
            try:
                answer = data['choices'][0]['message']['content'].strip()
            except (KeyError, IndexError) as err:
                raise RuntimeError('Grok returned an unexpected response structure.') from err

            if not answer:
                raise RuntimeError('Grok returned an empty response.')
            return answer
