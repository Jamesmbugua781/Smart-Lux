from app.schemas.announcements import AnnouncementResponse
from app.schemas.campus import CampusLocationResponse


class CampusService:
    @staticmethod
    def get_locations() -> list[CampusLocationResponse]:
        return [
            CampusLocationResponse(
                id='library',
                name='Central Library',
                category='Academic Hub',
                description='Demo campus library for research support and study access.',
                badge='Library',
                area='North Quadrant',
            ),
            CampusLocationResponse(
                id='computer-science',
                name='School of Computer Science',
                category='Academic Department',
                description='Sample department location for computing and digital studies.',
                badge='School',
                area='Innovation District',
            ),
            CampusLocationResponse(
                id='student-center',
                name='Student Services Center',
                category='Support Office',
                description='Demo student support services and general assistance point.',
                badge='Support',
                area='Main Campus',
            ),
        ]

    @staticmethod
    def get_location(location_id: str) -> CampusLocationResponse | None:
        for location in CampusService.get_locations():
            if location.id == location_id:
                return location
        return None

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

    @staticmethod
    def get_academics() -> list[dict[str, str | list[str]]]:
        return [
            {
                'id': 'calendar',
                'title': 'Academic calendar',
                'subtitle': 'Sample planning dates for prototype use.',
                'items': ['Semester start: 14 January', 'Mid-semester break: 24 March'],
            },
            {
                'id': 'schools',
                'title': 'Schools & departments',
                'subtitle': 'Demo faculty and school structure.',
                'items': ['School of Computer Science', 'School of Business and Economics'],
            },
        ]
