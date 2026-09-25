"""
features/academics/service.py
Returns academic calendar and department data (currently hard-coded demo data).
"""
from __future__ import annotations

from app.features.academics.schemas import AcademicSectionResponse


class AcademicsService:
    @staticmethod
    def get_academics() -> list[AcademicSectionResponse]:
        return [
            AcademicSectionResponse(
                id='calendar',
                title='Academic calendar',
                subtitle='Sample planning dates for prototype use.',
                items=['Semester start: 14 January', 'Mid-semester break: 24 March'],
            ),
            AcademicSectionResponse(
                id='schools',
                title='Schools & departments',
                subtitle='Demo faculty and school structure.',
                items=['School of Computer Science', 'School of Business and Economics'],
            ),
        ]
