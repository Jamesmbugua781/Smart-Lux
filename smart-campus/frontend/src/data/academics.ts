import type { AcademicSection } from '../types'

export const academicSections: AcademicSection[] = [
  {
    id: 'calendar',
    title: 'Academic calendar',
    subtitle: 'Sample planning dates for prototype use.',
    items: ['Semester start: 14 January', 'Mid-semester break: 24 March', 'Examination period: 15 May', 'Results release: 25 May'],
  },
  {
    id: 'schools',
    title: 'Schools & departments',
    subtitle: 'Demo faculty and school structure.',
    items: ['School of Computer Science', 'School of Business and Economics', 'Faculty of Engineering', 'School of Health Sciences'],
  },
  {
    id: 'courses',
    title: 'Courses',
    subtitle: 'Common academic support workflows.',
    items: ['Course registration guidance', 'Curriculum selection', 'Timetable planning', 'Academic advising'],
  },
  {
    id: 'examinations',
    title: 'Examinations',
    subtitle: 'Demo examination and assessment process.',
    items: ['Exam timetable', 'Revision resources', 'Clearance requirements', 'Results enquiries'],
  },
  {
    id: 'registration',
    title: 'Registration',
    subtitle: 'Prototype registration support information.',
    items: ['Online registration', 'Payment verification', 'Department approval', 'Late registration notice'],
  },
]
