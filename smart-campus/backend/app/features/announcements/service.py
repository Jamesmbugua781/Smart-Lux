"""
features/announcements/service.py
Returns campus announcements (currently hard-coded demo data).
"""
from __future__ import annotations

from app.features.announcements.schemas import AnnouncementResponse


class AnnouncementsService:
    @staticmethod
    def get_announcements() -> list[AnnouncementResponse]:
        return [
            AnnouncementResponse(
                id='a1',
                title='Semester registration opens',
                date='12 Sep 2026',
                category='Academic',
                summary='Demo announcement for the next registration cycle and advising window.',
            ),
            AnnouncementResponse(
                id='a2',
                title='Library study hours extended',
                date='09 Sep 2026',
                category='Library',
                summary='Sample update on extended quiet hours and digital resource access.',
            ),
        ]
