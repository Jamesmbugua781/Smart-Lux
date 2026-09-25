import type { AcademicSection, AnnouncementItem, CampusLocation, ServiceCategory } from '../types'

export const popularQuestions = [
  'Where is the library?',
  'How do I register for courses?',
  'Where is the School of Computer Science?',
  'What student services are available?',
  'Maktaba iko wapi?',
]

export const serviceCategories: ServiceCategory[] = [
  { id: 'academics', title: 'Academics', description: 'Course guidance, academic support, and study pathways.', icon: 'book-open' },
  { id: 'campus-services', title: 'Campus Services', description: 'Access essential campus support and student service points.', icon: 'building-2' },
  { id: 'student-support', title: 'Student Support', description: 'Wellbeing, advising, and student life connections.', icon: 'users' },
  { id: 'library', title: 'Library', description: 'Study spaces, borrowing, and digital research access.', icon: 'library' },
  { id: 'ict-services', title: 'ICT Services', description: 'Connectivity, digital services, and IT support.', icon: 'wifi' },
  { id: 'finance', title: 'Finance', description: 'Tuition, bursary information, and financial guidance.', icon: 'wallet' },
  { id: 'registry', title: 'Registry', description: 'Official records, registration, and academic records.', icon: 'file-text' },
  { id: 'departments', title: 'Departments', description: 'Schools, departments, and faculty contact information.', icon: 'graduation-cap' },
]

export const campusLocations: CampusLocation[] = [
  { id: 'library', name: 'Central Library', category: 'Academic Hub', description: 'Campus library for research support and study access.', badge: 'Library', area: 'North Quadrant', locationType: 'library', mapPosition: { left: '18%', top: '18%' } },
  { id: 'computer-science', name: 'School of Computer Science', category: 'Academic Department', description: 'Department location for computing and digital studies.', badge: 'School', area: 'Innovation District', locationType: 'school', mapPosition: { left: '65%', top: '28%' } },
  { id: 'student-center', name: 'Student Services Center', category: 'Support Office', description: 'Student support services and general assistance point.', badge: 'Support', area: 'Main Campus', locationType: 'support', mapPosition: { left: '52%', top: '42%' } },
  { id: 'registry', name: 'Registry Office', category: 'Administration', description: 'Office for records, admission, and student administration.', badge: 'Registry', area: 'Administration Block', locationType: 'registry', mapPosition: { left: '25%', top: '62%' } },
  { id: 'ict', name: 'ICT Help Desk', category: 'Technology', description: 'Digital access assistance and campus connectivity support.', badge: 'ICT', area: 'Tech Plaza', locationType: 'ict', mapPosition: { left: '74%', top: '64%' } },
  { id: 'engineering', name: 'Engineering Faculty', category: 'Academic Department', description: 'Faculty building for engineering and applied sciences.', badge: 'Faculty', area: 'Science Campus', locationType: 'school', mapPosition: { left: '42%', top: '76%' } },
]

export const announcementItems: AnnouncementItem[] = [
  { id: 'a1', title: 'Semester registration opens', date: '12 Sep 2026', category: 'Academic', summary: 'Registration opens for the next semester with advising available from each department.' },
  { id: 'a2', title: 'Library study hours extended', date: '09 Sep 2026', category: 'Library', summary: 'Extended quiet hours and digital resource access are now available during examination preparation.' },
  { id: 'a3', title: 'Campus Wi-Fi maintenance notice', date: '05 Sep 2026', category: 'ICT', summary: 'Scheduled maintenance will improve connectivity across teaching and residence areas.' },
  { id: 'a4', title: 'Career services workshop', date: '02 Sep 2026', category: 'Student Support', summary: 'Career guidance, placement preparation, and networking sessions are open to students.' },
  { id: 'a5', title: 'Academic advising week', date: '30 Aug 2026', category: 'Academic', summary: 'Meet with your academic advisor to review progress and plan the coming semester.' },
  { id: 'a6', title: 'New library databases available', date: '27 Aug 2026', category: 'Library', summary: 'Students can now access additional journals and research databases through the library portal.' },
  { id: 'a7', title: 'Student portal security update', date: '24 Aug 2026', category: 'ICT', summary: 'A security update introduces improved sign-in protection for student accounts.' },
  { id: 'a8', title: 'Wellbeing drop-in sessions', date: '20 Aug 2026', category: 'Student Support', summary: 'Drop-in support sessions are available throughout the month at the Student Services Center.' },
]

export const academicSections: AcademicSection[] = [
  { id: 'calendar', title: 'Academic calendar', subtitle: 'Key dates for planning the academic year.', items: ['Semester start: 14 January', 'Mid-semester break: 24 March', 'Examination period: 15 May', 'Results release: 25 May'] },
  { id: 'schools', title: 'Schools & departments', subtitle: 'Faculty and school structure for campus planning.', items: ['School of Computer Science', 'School of Business and Economics', 'Faculty of Engineering', 'School of Health Sciences'] },
  { id: 'courses', title: 'Courses', subtitle: 'Common academic support workflows.', items: ['Course registration guidance', 'Curriculum selection', 'Timetable planning', 'Academic advising'] },
  { id: 'examinations', title: 'Examinations', subtitle: 'Examination and assessment guidance.', items: ['Exam timetable', 'Revision resources', 'Clearance requirements', 'Results enquiries'] },
  { id: 'registration', title: 'Registration', subtitle: 'Registration support information.', items: ['Online registration', 'Payment verification', 'Department approval', 'Late registration notice'] },
  { id: 'finance', title: 'Fees & finance', subtitle: 'Guidance for fees, payments, and financial support.', items: ['Tuition fee schedule', 'Payment verification', 'Bursary guidance', 'Finance office support'] },
]
