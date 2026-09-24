import type { ServiceCategory } from '../types'

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'academics',
    title: 'Academics',
    description: 'Course guidance, academic support, and study pathways.',
    icon: 'book-open',
  },
  {
    id: 'campus-services',
    title: 'Campus Services',
    description: 'Access essential campus support and student service points.',
    icon: 'building-2',
  },
  {
    id: 'student-support',
    title: 'Student Support',
    description: 'Wellbeing, advising, and student life connections.',
    icon: 'users',
  },
  {
    id: 'library',
    title: 'Library',
    description: 'Study spaces, borrowing, and digital research access.',
    icon: 'library',
  },
  {
    id: 'ict-services',
    title: 'ICT Services',
    description: 'Connectivity, digital services, and IT support.',
    icon: 'wifi',
  },
  {
    id: 'finance',
    title: 'Finance',
    description: 'Tuition, bursary information, and financial guidance.',
    icon: 'wallet',
  },
  {
    id: 'registry',
    title: 'Registry',
    description: 'Official records, registration, and academic records.',
    icon: 'file-text',
  },
  {
    id: 'departments',
    title: 'Departments',
    description: 'Schools, departments, and faculty contact information.',
    icon: 'graduation-cap',
  },
]
